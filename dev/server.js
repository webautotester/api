var argv = require('yargs').usage('$0 server.js --port=[int] --mongo=[string] --scheduler=[string]').argv;
const PORT = argv.port || 80;
var serverNames = {
	mongoServerName : argv.mongo || 'localhost',
	schedulerServerName : argv.scheduler || 'localhost'
};

var winston = require('winston');
var express = require('express');
var helmet = require('helmet');
var path = require('path');
var bodyParser = require('body-parser');

var applicationRoot = __dirname;
const MongoClient = require('mongodb').MongoClient;
var app = express();

app.use(helmet());

//files for HTML pages
app.use(express.static(path.join(applicationRoot, './app')));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

const dbUrl = `mongodb://${serverNames.mongoServerName}:27017/wat_storage`;

initRoutes();

function initRoutes() {
	MongoClient.connect(dbUrl)
		.then(db => {
			require('./login.js').init(serverNames,app,db);
			require('./routes/scenario.js').init(serverNames,app,db);
			require('./routes/run.js').init(serverNames,app,db);
			require('./routes/schedule.js').init(serverNames,app,db);

			app.get('*', (req,res) => {
				res.sendFile(path.join(applicationRoot, './app/index.html'));
			});

			app.listen(PORT, function() {
				winston.info(`WAT Front is listening on port ${PORT}`);
			});
		})
		.catch((err) => {
			winston.info(err);
			setTimeout(() => {
				initRoutes();
			}, 3000);
		});
}
