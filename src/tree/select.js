/**
 * Created by Administrator on 2016/3/12 0012.
 */
import $ from 'jquery'
import Tree from './base'

class TreeSelect extends Tree{
    constructor($el,data,options){
        super($el,data,options);
    }
    val(){
        return [].map.call(this.$el.find('li:has(.select:checked)'),(n)=>{
            return {id:$(n).attr('id'),type:$(n).attr('type')};
        });
    }
    _bindEvent(){
        super._bindEvent();
        this.$el.on('click','li .select',function(){
            var p=$(this).parent().parent();
            p.find('li .select').prop('checked',$(this).is(':checked'));
            if($(this).is(':checked')){
                p.parents('li').children('.node').children('.select').prop('checked',true);
            }
        });
    }
    _itemTemplate(item){
        return `<li id="${item.id}" type="${item.type}" class="${item.last_level&&item.last_level.length>0?'expandable':''}">
                    <div class="node">
                        ${item.last_level&&item.last_level.length>0?'<span class="open center-icon"></span>':''}
                        <span class="line"></span>
                        <input type="checkbox" class="select" ${item.status==1?"checked":""}>
                        <a class="item-text">
                            <span class="${item.type==1?'title-icon open':'son-icon'}"></span>
                            <span class="title">${item.name}</span>
                        </a>
                        <span class="option"></span>
                    </div>
                    ${item.last_level&&item.last_level.length>0?'<ul class="children"></ul>':''}
                </li>`;
    }
}

$.fn.treeSelect=function(data,options){
    this.each(function(){
        $(this).data('treeSelect',new TreeSelect($(this),data,options));
    });
    return this;
};

export default TreeSelect;