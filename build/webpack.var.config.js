/**
 * Created by Administrator on 2016/5/23.
 */
var path=require('path');
var ROOT_PATH=path.resolve(__dirname,'../'),
    APP_PATH=path.resolve(ROOT_PATH,'src'),
    BUILD_PATH=path.resolve(ROOT_PATH,'dist');
module.exports={
    ROOT_PATH:ROOT_PATH,
    APP_PATH:APP_PATH,
    BUILD_PATH:BUILD_PATH
}