/**
 * Created by Administrator on 2016/2/29 0029.
 */
import $ from 'jquery'
import _ from 'lodash'
import './css/ui.css'
class Tree{
    constructor($el,data,options){
        this.$el=$el;
        this.data=data;
        this.options=$.extend({},this._default(),options);
        this.$html=$(this.options.outTemplate);
        this.render();
        this._bindEvent();
    }
    render(){
        this.data.forEach((item)=>{
            this._traverse(item,this.$html);
        });
        this.$el.html(this.$html);
        this.options.option.forEach((n,i)=>{
            this.$el.find('.option').append(`<a>${n.text}</a>`).each(function(){
                $(this).children(`a:eq(${i})`).click(function(){
                    var id=$(this).parents('li').attr('id'),
                        type=$(this).parents('li').attr('type');
                    n.callback&&n.callback(id,type);
                })
            });
        });
        return this;
    }
    _traverse(item,$root){
        var $current=$(this._itemTemplate(item));
        $root.append($current);
        if($.isArray(item.last_level)&&item.last_level.length>0){
            item.last_level.forEach((n)=>{
                this._traverse(n,$current.children('ul.children'));
            });
        }
    }
    _bindEvent(){
        //显示隐藏
        this.$el.on('click','li .item-text,li .center-icon',function(e){
            var parent=$(this).parent().parent();
            var children=parent.children('ul.children'),
                icon=parent.children('.node').find('.center-icon,.title-icon');
            if(!parent.is('.expandable')){
                return;
            }
            if(children.is(':visible')){
                icon.removeClass('open');
                parent.removeClass('open');
                children.hide();
            }else{
                icon.addClass('open');
                parent.addClass('open');
                children.show();
            }
        }).on('mouseenter','li .item-text',function(){
            $(this).children('.option').addClass('on');
        }).on('mouseleave','li .item-text',function(){
            $(this).children('.option').removeClass('on');
        });
    }
    _itemTemplate(item){
        return `<li id="${item.id}" type="${item.type}" class="${item.last_level&&item.last_level.length>0?'expandable':''}">
                    <div class="node">
                        ${item.last_level&&item.last_level.length>0?'<span class="open center-icon"></span>':''}
                        <span class="line"></span>
                        <a class="item-text">
                            <span class="${item.type==1?'title-icon open':'son-icon'}"></span>
                            <span class="title">${item.name}</span>
                        </a>
                        <span class="option"></span>
                    </div>
                    ${item.last_level&&item.last_level.length>0?'<ul class="children"></ul>':''}
                </li>`;
    }
    _default(){
        return {
            option:[],
            outTemplate:'<ul class="tree"></ul>'
        };
    }
}

$.fn.tree=function(data,options){
    this.each(function(){
        $(this).data('tree',new Tree($(this),data,options));
    });
    return this;
};

export default Tree;

