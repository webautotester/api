var argv = require('yargs').usage('$0 server.js --mongo=[string]').argv;
var serverNames = {
    mongoServerName : argv.mongo || 'localhost',
};

var winston = require('winston');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var applicationRoot = __dirname;
var app = express();

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

const loginRoute = require('./login.js')
loginRoute.init(serverNames,app);


app.listen(8080, function() {
    winston.info('WAT Front is listening on port 8080');
});
