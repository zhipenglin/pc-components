/**
 * Created by Administrator on 2016/2/25 0025.
 * 封装jquery ajax 添加防重复提交 添加默认参数 添加默认事件处理
 */
import $ from 'jquery';
import '../dialog/base'

var locked={};

class Ajax{
    constructor(el,options){
        this.$el=el;
        this.options=$.extend({},this._default(),options);
        this.promise=this._send();
        this.errorObj=null;
    }
    success(callback){
        this.promise.then((data)=>{
            this.errorObj||callback.call(this,data);
            return data;
        });
        return this;
    }
    getPromise(){
        return this.promise.then((data)=>{
            return new Promise((resolve, reject)=>{
                if(this.errorObj){
                    reject(new Error(`ajax发送发生异常 from:"${this.options.url}"`));
                }else{
                    resolve(data);
                }
            });
        });
    }
    error(callback){
        this.promise.then((data)=>{
            this.errorObj&&callback.call(this,this.errorObj);
            return data;
        });
        return this;
    }
    _default(){
        return {
            type:'POST',
            dataType:'json',
            beforeSend(){},
            error(){}
        }
    }
    _before(){
        //锁定ajax发送
        locked[this.options.url]=true;
        this.$el.addClass('ajax-sending');
        //触发before事件
        if(this.options.beforeSend.call(this)===false){
            //如果返回false取消ajax发送
            return;
        }
        //生成promise对象
        var promise=new Promise((resolve, reject)=>{
            $.ajax({
                url:this.options.url,
                type:this.options.type,
                data:this.options.data,
                dataType:this.options.dataType,
                error(XMLHttpRequest, textStatus, errorThrown){
                    reject({type:textStatus,data:XMLHttpRequest});
                },
                success(data){
                    if(data.status==1){
                        resolve(data.data);
                    }else{
                        reject({type:'server',data:data});
                    }
                },
                complete:()=>{
                    //解除ajax锁定
                    locked[this.options.url]=false;
                    this.$el.removeClass('ajax-sending');
                }
            });
        });
        return promise.catch(({type,data})=>{
            if(this.options.error!==false&&this.options.error(type,data)!==false){
                if(type=='server'){
                    alert(data.message);
                }else{
                    alert(type);
                }
            }
            this.errorObj={type,data};
            return data;
        });
    }
    clear(url){
        locked[this.options.url]=false;
    }
    _send(){
        if(locked[this.options.url]){
            return;
        }
        return this._before();
    }
}

$.fn.ajax=function(options){
    return new Ajax(this,options);
}

export default Ajax;
