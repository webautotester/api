const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');

module.exports.init = (serverNames, webServer) => {
	const dbUrl = `mongodb://${serverNames.mongoServerName}:27017/wat_storage`;
	webServer
		.get('/run/:sid', (req, res) => {
			var user = req.user;
			var sid = new ObjectID(req.params.sid);
			const N = 10;
			if (req.isAuthenticated()) {
				MongoClient.connect(dbUrl)
					.then(db => {
						db.collection('run', (err, runCollection) => {
							if (err) {
								res.status(404).send(err).end();
							} else {
								runCollection.find({uid:new ObjectID(user._id), sid:sid}).skip(db.collection.count() - N).toArray()
									.then(runsArray => {
										res.status(200).send(runsArray).end();
									}).catch(err => {
										res.status(500).send(err).end();
									});
							}
						});
						db.close();
					}).catch(err => {
						winston.info(err);
						res.status(500).send(err).end;
					});
			} else {
				res.status(401).send('access denied').end();
			}
		});
};