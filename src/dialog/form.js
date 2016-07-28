/**
 * Created by Administrator on 2016/2/25 0025.
 */
import $ from 'jquery'
import ArtBase from './base'
class ArtForm extends ArtBase{
    constructor(options){
        super(options);
        this.show();
        this._bindEvent();
    }
    show(){
        if(this._destroyed()){
            this._init();
        }
        this._art.showModal();
        return this;
    }
    getContent(){
        return super.getContent().find('.common-artdialog .con');
    }
    _default(){
        return $.extend({},super._default(),{
            drag:true,
            ok(){},
            cancel(){
                this.close();
            }
        });
    }
    _template(content){
        return super._template(`<div class="common-artdialog"><div class="con add-class">${content}</div>
        <div class="art-bottom">
            <a class="ok-button btn">确定</a>
            <a class="cancel-button btn">取消</a>
        </div></div>`);
    }
    _bindEvent(){
        $(`${super.getId()} .cancel-button`).click(()=>this.options.cancel.call(this));
        $(`${super.getId()} .ok-button`).click(()=>this.options.ok.call(this));
    }
}

$.artForm=function(options){
    return new ArtForm(options);
};

export default ArtForm;