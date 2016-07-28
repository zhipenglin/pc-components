/**
 * Created by Administrator on 2016/2/25 0025.
 */
import $ from 'jquery'
import _ from 'lodash'
import artDialog from './dialog/lib/dialog'
import './tools/ajax'
import './tools/template'
import './tools/base64'


import './dialog/base'
import './dialog/form'
import './dialog/check'
import './dialog/balloon'

import './form/core'

import './tree/base'
import './tree/select'

import './upload/base'
import './upload/img'
import './upload/avatar'

import './crop/base'

window.$=$;
window._=_;
window.dialog=artDialog;

Promise.prototype.done = function (onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
        .catch(function (reason) {
            //throw reason;
            console.warn(reason&&reason.message?reason.message:reason);
            //console.warn('promise has exception not be handling');
        });
};