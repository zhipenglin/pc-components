/**
 * Created by Administrator on 2016/3/8 0008.
 */
import $ from 'jquery'
import ImageUpload from './img'
import Crop from '../crop/base'

class AvatarUpload extends ImageUpload{
    _addFormTag(){
        this.$el.addClass('form-avatar');
    }
    _success(res,img,callback){
        var crop=new Crop(res.data);
        //img.attr('data',res.data).removeClass('doing').html(`<i class="img-close"></i><img src="http://img.91ddcc.com/${res.data}">`);
        //callback();
    }
    _default(){
        return $.extend({},super._default(),{
            multiple:false
        });
    }
}

$.fn.uploadAvatar=function(options){
    this.each(function(){
        $(this).data('upload-avatar',new AvatarUpload($(this),options));
    });
    return this;
}

export default AvatarUpload