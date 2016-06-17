/**
 * Created by Administrator on 2016/3/1 0001.
 */
import $ from 'jquery'

class Upload{
    constructor($el,options){
        this.$el=$el;
        this.options=$.extend({},this._default(),options);
        this._init();
    }
    send(){
        if(this.files.length > 0) {
            var arrayOfPromises = [].slice.call(this.files, 0).map((file,index)=>{
                return this._handleUpload(file,index);
            });
            Promise.all(arrayOfPromises).then((allFiles)=>{
                this.$el.trigger('files_uploaded');
            }).catch((err)=>{
                this.$el.trigger('file_error',err);
            });
        } else {
            var err = new Error(this._errorMessage('SELECT_NULL'));
            this.$el.trigger('file_error',err);
        }
    }
    _init(){
        this._bindEvent();
    }
    _bindEvent(){
        this.$el.on('click',()=>{
            this._setInput();
            this.input.trigger('click');
        });
    }
    _setInput(){
        this.input=$(`<input type="file" ${this.options.multiple?'multiple="multiple"':''}>`);
        this._bindInputEvent();
    }
    _bindInputEvent(){
        this.input.on('change',(e)=>{
            this.files=event.target.files;
            this.send();
        });
    }
    _handleUpload(file,index,data){
        this.$el.trigger('before_file_upload',index);
        var form = new FormData();
        var xhr = new XMLHttpRequest();
        try {
            form.append('Content-Type', file.type || 'application/octet-stream');
            form.append('file', file);
            _.each(data,(n,k)=>form.append(k,n));
        } catch (err) {
            this.$el.trigger('file_error',err);
            return;
        }
        return new Promise((resolve, reject)=>{
            if(file.size>this.options.size*1024*1024){
                var error=new Error(this._errorMessage('SIZE_EXCEED'));
                error.index=index;
                reject(error);
                return;
            }
            if(file.type&&this.options.type!='*'&&!file.type.match(this.options.type)){
                var error=new Error(this._errorMessage('TYPE_ERROR'));
                error.index=index;
                reject(error);
                return;
            }
            xhr.upload.addEventListener('progress', this._onProgress.bind(this), false);
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState < 4) {
                    return;
                }
                if (xhr.status < 400) {
                    var res = JSON.parse(xhr.responseText);
                    this.$el.trigger('file_upload',res);
                    resolve(res);
                } else {
                    var err = JSON.parse(xhr.responseText);
                    err.status = xhr.status;
                    err.statusText = xhr.statusText;
                    this.$el.trigger('file_error',err);
                    reject(err);
                }
            };

            xhr.onerror = ()=>{
                var err = JSON.parse(xhr.responseText);
                err.status = xhr.status;
                err.statusText = xhr.statusText;
                this.$el.trigger('file_error',err);
                reject(err);
            };
            xhr.open('POST', this.options.url, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.send(form);
            this.$el.trigger('after_file_upload');
        });
    }
    _errorMessage(type){
        var message={
            SELECT_NULL:'没有选中符合条件的文件',
            TYPE_ERROR:'文件类型不正确',
            SIZE_EXCEED:`文件大小不能超过${this.options.size}M`
        }
        return message[type];
    }
    _onProgress(e){
        this.$el.trigger('progress', (e.loaded / e.total) * 100);
    }
    _default(){
        return {
            url:'',
            multiple:true,
            size:5,//单位MB
            type:'*'
        }
    }
}

$.fn.upload=function(options){
   this.each(function(){
       $(this).data('upload',new Upload($(this),options));
   });
    return this;
};

export default Upload