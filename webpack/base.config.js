const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

var config = {
	context: path.resolve(__dirname, '..'),
	entry: {
		'app/js/app': './dev/app/js/App.jsx'
	},
	output: {
		path: path.resolve(__dirname, '../ops'),
		filename: '[name].bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			include: path.resolve(__dirname, '../dev/app'),
			use: 'babel-loader',
		}, {
			test: /\.less$/,
			loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader!less-loader'
			})
		}]
	},
	plugins: [
		new CopyPlugin([
			{from: './dev/server.js', to: 'server.js'},
			{from: './dev/login.js', to: 'login.js'},
			{from: './dev/routes/scenario.js', to: 'routes/scenario.js'},
			{from: './dev/routes/run.js', to: 'routes/run.js'},
			{from: './dev/routes/schedule.js', to: 'routes/schedule.js'},
			{from: './dev/app/index.html', to: 'app/index.html'},
			{from: './dev/app/img/success.png', to: 'app/img/success.png'},
			{from: './dev/app/img/failure.png', to: 'app/img/failure.png'},
			{from: './dev/app/img/check.svg', to: 'app/img/check.svg'},
			{from: './dev/app/img/replay.svg', to: 'app/img/replay.svg'},
			{from: './dev/app/img/record.svg', to: 'app/img/record.svg'}
		]),
		new ExtractTextPlugin('app/main.css')
	]
};

module.exports = config;
