/**
 * Created by Administrator on 2016/2/25 0025.
 */
import $ from 'jquery'
import artDialog from './lib/dialog'
const defaults={};
var UUID=0;
class ArtBase{
    static dialog(options){
        return artDialog(options);
    }
    constructor(options){
        this.options=$.extend({},this._default(),options);
        this.options.padding=0;
        UUID+=1;
        this.id=UUID;
        this.options.content=this._template(this.options.content);
    }
    show(){
        if(this._destroyed()){
            this._init();
        }
        this._art.show();
        return this;
    }
    close(){
        if(this._destroyed()){
            return;
        }
        this._art.remove();
        return this;
    }
    content(html){
        if(this._destroyed()){
            return;
        }
        this._art.content(this._template(html));
        return this;
    }
    title(str){
        if(this._destroyed()){
            return;
        }
        this._art.title(str);
        return this;
    }
    width(val){
        if(this._destroyed()){
            return;
        }
        this._art.width(val);
        return this;
    }
    height(val){
        if(this._destroyed()){
            return;
        }
        this._art.height(val);
        return this;
    }
    reset(){
        if(this._destroyed()){
            return;
        }
        this._art.reset();
        return this;
    }
    hide(){
        if(this._destroyed()){
            return;
        }
        this._art.close();
    }
    getId(){
        if(this._destroyed()){
            return;
        }
        return `#art-${this.id}`;
    }
    getContent(){
        if(this._destroyed()){
            this._init();
        }
        return this.$el;
    }
    _init(){
        this._art=ArtBase.dialog(this.options);
        this.$el=$(this.getId());
    }
    _destroyed(){
        if(!this._art||this._art.destroyed){
            return true;
        }
    }
    _default(){
        return {};
    }
    _template(content){
        return `<div id="art-${this.id}" class="art-dialog">${content}</div>`
    }
}

$.art=function(options){
    return new ArtBase(options);
};

export default ArtBase;
