/**
 * Created by Administrator on 2016/2/26 0026.
 */
import $ from 'jquery'
import _ from 'lodash'
import '../tools/ajax'
class Form{
    static parse($el){
        var data={};
        $el.serializeArray().forEach((n)=>{
            if(!n.name){
                return;
            }
            if(data[n.name]===undefined){
                data[n.name]=n.value;
            }else if($.isArray(data[n.name])){
                data[n.name].push(n.value);
            }else{
                data[n.name]=[data[n.name]];
                data[n.name].push(n.value);
            }
        });
        return data;
    }
    constructor($el,options){
        this.$el=$el;
        this.options=$.extend({},this._default(),options);
        this.type=this._setType();
        this.action=this.options.url||this.$el.attr('action');
        this.method=this.options.type||this.$el.attr('method');
        this.extra=[];
        this.getFormData();
        this._bindEvent();

        this.middleware={};
    }
    addExtra(obj){
        if(obj.$el.is('[name]')&&$.isFunction(obj.val)){
            this.extra.push(function(){
                return {name:obj.$el.attr('name'),value:obj.val()};
            });
        }
    }
    getFormData(){
        this.data=Form.parse(this.$el);
        var _this=this;
        this.extra.forEach((n)=>{
            var val=n();
            this.data[val['name']]=val['value'];
        });
        return this.data;
    }
    use(name,callback){
        if(!this.middleware[name]){
            this.middleware[name]={
                value:null
            };
        }
        if(!$.isArray(this.middleware[name].func)){
            this.middleware[name].func=[];
        }
        this.middleware[name].func.push(callback);
        return this;
    }
    async validate(field){
        field=$(field);
        if(field.is('option')){
            field=field.parent();
        }
        var name=field.attr('name');
        var tip=this.$el.find(`.${this.options.tipClass}.${name}`),
            fac=field.attr('fac'),
            des=field.attr('des');

        if(!fac){
            return true;
        }
        //识别有否存在REQ参数
        if(fac.search(/REQ/i)>-1){
            if(this.data[name]===''||this.data[name]===undefined){
                tip.html(this.options.errorTemplate(this.options.msgRequired.replace('%s',des)));
                return false;
            }
        }
        //识别长度参数?-?
        var lengthMatch=fac.match(/[0-9]*\-?[0-9]{1,}/);
        if(lengthMatch){
            var lengthInfo=lengthMatch[0].split('-');
            if(lengthInfo.length==2){
                if(this.data[name].length<lengthInfo[0]||this.data[name].length>lengthInfo[1]){
                    tip.html(this.options.errorTemplate(this.options.msgLength.replace('%s',des).replace('%s',lengthMatch[0])));
                    return false;
                }
            }else{
                if(this.data[name].length>lengthInfo[0]){
                    tip.html(this.options.errorTemplate(this.options.msgMax.replace('%s',des).replace('%s',lengthMatch[0])));
                    return false;
                }
            }
        }
        //识别type参数
        for(let key in this.type){
            var keyMatch=fac.match(new RegExp(key,'i'));
            if(this.data[name]!=''&&keyMatch&&!this.type[key].test(this.data[name])){
                tip.html(this.options.errorTemplate(this.options[`msg${key}`].replace('%s',des)));
                return false
                break;
            }
        }

        //用户自定义校验中间件
        if(this.middleware[name]&&this.middleware[name].value!==this.data[name]&&this.middleware[name].func&&this.middleware[name].func.length>0){
            tip.html(this.options.loadingTemplate());
            let res=await Promise.all(this.middleware[name].func.map(n=>{
                return new Promise((resolve,reject)=>{
                    n(this.data[name],resolve,reject);
                });
            })).then(()=>{
                this.middleware[name].value=this.data[name];
                return true;
            }).catch((message)=>{
                tip.html(this.options.errorTemplate(message));
                return false;
            });
            if(!res){
                return false;
            }
        }
        tip.html('');
        return true;
    }
    validateAll(){
        return Promise.all(_.map(this.$el.find(this.options.fieldSelector),n=>{
            return this.validate(n);
        }));
    }
    _bindEvent(){
        var _this=this;
        this.$el.on(this.options.dataChangeEvent.join(' '),this.options.fieldSelector,function(){
            if(!$(this).is('[name]')){
                return;
            }
            _this.$el.trigger('form-change',this);

        }).on(this.options.validateEvent.join(' '),this.options.fieldSelector,function(){
            _this.validate(this);
        }).on('focus',this.options.fieldSelector,function(){
            _this.$el.find(`.${_this.options.tipClass}.${$(this).attr('name')}`).html('');
        }).on('form-change',(e,target)=>{
            this.getFormData();
        }).on('submit',(e)=>{
            e.preventDefault();
            _this.$el.trigger('form-submit');
        }).on('form-submit',()=>this.submit());
    }
    submit(){
        return this.validateAll().then((res)=>{
            return new Promise((resolve, reject)=>{
                if(!_.every(res)){
                    reject(new Error(`表单验证不能通过 from:"${this.action}"`));
                    return;
                }
                if(this.options.beforeSubmit.call(this)===false){
                    reject(new Error(`请求被beforeSubmit阻止 from:"${this.action}"`));
                    return;
                }
                resolve();
            }).then((res)=>{
                return this.$el.ajax({
                    type:this.method,
                    url:this.action,
                    data:this.data,
                    error:this.options.error
                }).success((res)=>{
                    this.options.success.call(this,res);
                    return res;
                }).getPromise();
            });
        });
    }
    _setType(){
        return {
            Char:/^[a-zA-Z]*$/,
            Num:/^(\d)*$/,
            Email:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            Tel:/^1\d{10}$/,
            Tels:/^(0?1[0-9]{10})$|^((0(10|2[1-3]|[3-9]\d{2}))?-?[1-9]\d{6,7})$/,
            Pwd:/\S*$/,
            ZH_CN:/^[\u4e00-\u9fa5]*$/,
            NOT_EN:/^([^a-zA-Z]{1,})$/,
            NUM_OR_CHAR:/^[a-zA-Z0-9]*$/,
            NUM_AND_CHAR : /^(([0-9]+[a-zA-Z]+)|([a-zA-Z]+[0-9]+))*$/,
            NUM_OR_CHAR_UNDERLINE:/^\w*$/
        };
    }
    _default(){
        return {
            msgDefault:'请输入%s',
            msgRequired:'%s不能为空',
            msgLength:'%s的长度必须为%s个字符',
            msgMax:'%s最多为%s个字符',
            msgChar:'%s只允许为字母',
            msgNum:'%s只允许为数字',
            msgEmail:'请输入正确的%s',
            msgTel:'请输入正确的11位%s',
            msgTels:'%s必须为手机号或座机号',
            msgPwd:'%s不允许有空格',
            msgZH_CN:'%s只允许为中文',
            msgNOT_EN:'%s不能包含英文字符',
            msgNUM_OR_CHAR:'%s只允许为数字或字母',
            NUM_AND_CHAR:'%s必须至少包含一个数字和一个字母',
            msgNUM_OR_CHAR_UNDERLINE:'%s只允许数字、字母或下划线',
            tipClass:'error',
            errorTemplate(msg){
                return `<i></i>${msg}`;
            },
            loadingTemplate(){
                return '<i class="form-field-loading"></i>';
            },
            beforeSubmit(){},
            success(){},
            error(){},
            dataChangeEvent:['input','blur','change','form-dataChange'],
            validateEvent:['blur','form-validate'],
            fieldSelector:'.form-img[name],input:not([type]),input[type="color"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="email"],input[type="file"],input[type="hidden"],input[type="month"],input[type="number"],input[type="password"],input[type="range"],input[type="search"],input[type="tel"],input[type="text"],input[type="time"],input[type="url"],input[type="week"],input[type="checkbox"],input[type="radio"],select,textarea'
        };
    }
}

$.fn.form=function(options){
    this.filter('form').each(function(){
        $(this).data('form',new Form($(this),options));
    });
    return this;
}

//注册

export default Form;