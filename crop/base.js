/**
 * Created by Administrator on 2016/3/8 0008.
 */
import $ from 'jquery'
import ArtForm from '../dialog/form'
import './lib/jquery.Jcrop'
import './css/jquery.Jcrop.css'
import './css/ui-crop.css'
class Crop{
    constructor(img,options){
        this.img=img;
        this.options=$.extend({},this._default(),options);
        this._init();
    }
    _init(){
        this.art=new ArtForm({
            title:'图片裁剪',
            content:`<div class="crop"><img class="target" src="http://img.91ddcc.com/${this.img}"></div>`
        });
        this.art.getContent().find('.target').Jcrop();
        var img=new Image();
        img.src=`http://img.91ddcc.com/${this.img}`;
        img.onload=()=>{
            this.art.reset();
        }
    }
    _default(){
        return {};
    }
}

$.crop=function(options){
    return new Crop(options);
};

export default Crop