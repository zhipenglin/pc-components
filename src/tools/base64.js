/**
 * Created by Administrator on 2016/3/7 0007.
 */
import $ from 'jquery'

import base64 from 'base64'

$.base64=function(str){
    if(str){
        str=str.toString();
        return base64.btoa(str);
    }
};

$.base64Decode=function(str){
    if(str){
        return base64.atob(str);
    }
};