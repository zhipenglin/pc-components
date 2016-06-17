var webpack = require('webpack');
var path=require('path');
module.exports={
	entry:{
		main:'./main.js'
	},
	output:{
		path:__dirname,
		filename:'../lib.js'
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
				loader:'babel',
				query:{
					presets: ['es2015']
				}
			}
		]
	},
	babel: {
		presets: ['es2015', 'stage-0'],
		plugins: ['transform-runtime']
    },
	plugins:[
		/*new webpack.optimize.UglifyJsPlugin({
			mangle:{
				except:['exports','require']
			}
		})*///此处代码为压缩lib.js代码，打开后生成的lib.js为压缩后的文件
	],
	devtool: 'source-map'
};