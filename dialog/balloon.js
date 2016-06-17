/**
 * Created by Administrator on 2016/3/2 0002.
 */
import $ from 'jquery'
import ArtBase from './base'
class ArtBalloon extends ArtBase{
    constructor($el,options){
        super(options);
        this.$target=$el;
        this._bindEvent();
    }
    show(){
        if(this._destroyed()){
            this._init();
        }
        this._art.show(this.$target[0]);
    }
    _init(){
        this.options.quickClose=true;
        super._init();
    }
    _bindEvent(){
        if(this.options.trigger=='click'){
            this.$target.on('click',()=>{
                this.show();
            });
        }
    }
    _default(){
        return $.extend({},{
            trigger:'click'//over
        },super._default());
    }
}

$.fn.artBalloon=function(options){
    this.each(function(){
        $(this).data('art-balloon',new ArtBalloon($(this),options));
    });
    return this;
};

export default ArtBalloon;