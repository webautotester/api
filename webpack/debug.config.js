const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

var config = merge(baseConfig, {
	devtool: 'source-map'
});

module.exports = config;
