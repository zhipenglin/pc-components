var webpack = require('webpack');
var path=require('path');
var VAR=require('./webpack.var.config.js');
var APP_PATH=VAR.APP_PATH,
    BUILD_PATH=VAR.BUILD_PATH;
module.exports={
    entry:{
        main:path.resolve(APP_PATH,'main.js')
    },
    output:{
        path:BUILD_PATH,
        filename:'lib.js'
    },
    module:{
        loaders:[
            {
                test:/\.css$/,
                loader:'style!css!autoprefixer-loader'
            },
            {
                test:/\.(png|jpg|gif$)/,
                loader:'url-loader?limit=8192'
            },
            {
                test:/\.js$/,
                exclude:/(node_modules|bower_components)/,
                loader:'babel'
            }
        ]
    }
};