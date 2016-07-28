/**
 * Created by Administrator on 2016/3/2 0002.
 */
import $ from 'jquery'
import Upload from './base'
import EXIF from './lib/exif'
import zip from './lib/zip'

import './css/ui-upload-img.css'
class ImageUpload extends Upload{
    constructor($el,options){
        super($el,options);
        if(!this.options.url){
            this.options.url=this.$el.attr(url);
        }
        this.options.type='image/*';
    }
    send(){
        if(this.length==this.options.maxLength){
            this.$el.trigger('file_error',new Error(this._errorMessage('LENGTH_EXCEED')));
            return;
        }
        //限制选择文件超过maxlength的情况，丢弃超出的部分
        if(this.options.multiple){
            this.files=[].slice.call(this.files, 0,this.options.maxLength-this.length);
        }
        super.send();
        return this;
    }
    del(index){
        $(`#img-${index}`).remove();
        this.length=this.preview.find('item-item[data]').length;
        this.button.show();
        this.$el.trigger('form-dataChange');
        return this;
    }
    add(imgList){
        if(!$.isArray(imgList)){
            imgList=[imgList];
        }
        if(this.options.multiple){
            imgList.slice(imgList,0,this.options.maxLength-this.length);
        }else if(this.length>0){
            imgList=[];
        }
        imgList.forEach((n,i)=>{
            this.preview.append(`<div id="img-${this.length+i}" data="${n}" index="${this.length+i}" class="img-item"><i class="img-close"></i><img src="http://img.91ddcc.com/${n}"></div>`);
        });
        this.length=this.preview.find('item-item[data]').length;
        if(!this.options.multiple||this.length==this.options.maxLength){
            this.button.hide();
        }
        this.$el.trigger('form-dataChange');
    }
    val(){
        var list=this.preview.find('.img-item[data]').map(function(){
            return $(this).attr('data');
        });
        return this.options.multiple?list:list[0];
    }
    _init(){
        var form=this.$el.parents('form').data('form');
        if(form){
            form.addExtra(this);
        }
        this.length=0;
        this._addFormTag();
        this.preview=$('<div class="img-preview"></div>');
        this.button=$('<div class="img-item add-button"></div>');
        this.$el.html('').append(this.preview).append(this.button);
        if(this.$el.is('[value]')){
            var value=this.$el.attr('value');
            if(this.options.multiple){
                value=JSON.parse(value);
            }
            this.add(value);
        }
        super._init();
    }
    _addFormTag(){
        this.$el.addClass('form-img');

    }
    _handleUpload(file,index){
        index+=this.length;
        var img=$(`<div id="img-${index}" index="${index}" class="img-item doing"><i class="img-close"></i><div class="gray-box"><div class="blue-box"></div></div></div>`);
        this.preview.append(img);
        if(!this.options.multiple||this.length==this.options.maxLength){
            this.button.hide();
        }
        this.$el.on('progress',(e,percent)=>{
            img.find('.blue-box').css('width',`${percent}%`);
        });
        return new Promise((resolve, reject)=>{
            if(file.type==''&&!/\.(jpg|jpeg|gif|png)$/.test(file.name)){
                var err=new Error(this._errorMessage('TYPE_ERROR'));
                err.index=index;
                reject(err);
                return;
            }
            EXIF.getData(file,function(){
                EXIF.getAllTags(this);
                resolve(EXIF.getTag(this, 'Orientation'));
            });
        }).then((orientation)=>{
            return zip(file).then((file)=>{
                return super._handleUpload(file,index,{orientation})
            });
        }).then((res)=>{
                this._success(res,img,()=>{
                    this.$el.trigger('form-dataChange').trigger('form-validate');
                    this.length=this.preview.find('item-item[data]').length;
                });
        })
    }
    _success(res,img,callback){
        img.attr('data',res.data).removeClass('doing').html(`<i class="img-close"></i><img src="http://img.91ddcc.com/${res.data}">`);
        callback();
    }
    _bindEvent(){
        this.button.on('click',()=>{
            this._setInput();
            this.input.trigger('click');
        });
        var _this=this;
        this.$el.on('before_file_upload',(e,index)=>{
        }).on('file_error',(e,err)=>{
            alert(err.message);
            $(`#img-${err.index}`).remove();
            this.button.show();
        }).on('progress',(e)=>{
        }).on('click','.img-close',function(){
            _this.del($(this).parent().attr('index'));
        });
    }
    _errorMessage(type){
        var message={
            LENGTH_EXCEED:`只允许上传${this.options.maxLength}张图片`,
            SELECT_NULL:'没有选中任何图片',
            TYPE_ERROR:'请上传jpg，jpeg，gif，png格式的图片',
            SIZE_EXCEED:`图片大小不能超过${this.options.size}M`
        }
        return message[type];
    }
    _default(){
        return $.extend({},super._default(),{
            url:'/common/upload',
            maxLength:9
        })
    }
}

$.fn.uploadImg=function(options){
    this.each(function(){
        $(this).data('upload-img',new ImageUpload($(this),options));
    });
    return this;
};

export default ImageUpload