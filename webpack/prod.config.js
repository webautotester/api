const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const webpack = require('webpack');

var config = merge(baseConfig, {
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
});

module.exports = config;
