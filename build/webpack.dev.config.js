/**
 * Created by Administrator on 2016/5/21.
 */
var baseConfig=require('./webpack.base.config.js');
var merge = require('webpack-merge');
var VAR=require('./webpack.var.config.js');
module.exports=merge(baseConfig,{
    devtool:'#source-map'
});
