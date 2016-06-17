/**
 * Created by Administrator on 2016/2/25 0025.
 */
import $ from 'jquery'

$.template=function(){
    var arg=[].slice.call(arguments,0),name;
    if(typeof arg[0]=='string'){
        name=arg[0];
    }
    var dataName=`template-${name||'default'}`;

    var $tpl=$(document).data(dataName);
    if($tpl){
        if($.isFunction(arg[arg.length-1])){
            let callback=arg[arg.length-1];
            callback($tpl);
            $(document).data(dataName,$tpl);
        }
        return $tpl[0].outerHTML;
    }else{
        var $dom=$(`script[type="template"]${name?`[name="${name}"]`:''}:eq(0)`);
        $tpl=$($dom.html());
        $dom.remove();
        $(document).data(dataName,$tpl);
        return $tpl[0].outerHTML;
    }
};