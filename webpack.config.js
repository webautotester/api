const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

var config = {
	entry: {
		//context: path.resolve(__dirname, 'dev'),
		'app/js/app': './dev/app/js/index.jsx',
	},
	output: {
		path: path.resolve(__dirname, 'ops'),
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			include: path.resolve(__dirname,'dev/app'),
			exclude: /node_modules/,
			loader: 'babel-loader',
		}]
	},
	plugins: [
		new CopyPlugin([
			{ from: './dev/server.js', to: 'server.js' },
			{ from: './dev/login.js', to: 'login.js' },
			{ from: './dev/routes/scenario.js', to: 'routes/scenario.js' },
			{ from: './dev/routes/run.js', to: 'routes/run.js' },
			{ from: './dev/routes/schedule.js', to: 'routes/schedule.js' },
			{ from: './dev/app/index.html', to: 'app/index.html' },
			{ from: './dev/app/img/success.png', to: 'app/img/success.png' },
			{ from: './dev/app/img/failure.png', to: 'app/img/failure.png' },
			{ from: './dev/app/img/check.png', to: 'app/img/check.png' },
			{ from: './dev/app/img/replay.png', to: 'app/img/replay.png' },
			{ from: './dev/app/img/record.png', to: 'app/img/record.png' },
			{ from: './dev/app/img/demo.mp4', to: 'app/img/demo.mp4' }
		]),
	]
};

module.exports = config;
