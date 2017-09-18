const winston = require('winston');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const {Scenario} = require('wat_action_nightmare');

module.exports.init = (serverNames, webServer) => {
	const dbUrl = `mongodb://${serverNames.mongoServerName}:27017/wat_storage`;
	webServer
		.get('/scenario',(req, res) => {
			var user = req.user;
			if (req.isAuthenticated()) {
				MongoClient.connect(dbUrl)
					.then(db => {
						db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
							if (err) {
								winston.info('Collection scenarion not created yet !');
								res.status(404).send(err).end();
							} else {
								scenarioCollection.find({uid:new ObjectID(user._id)}).toArray()
									.then(scenariosArray => {
										winston.info(`RouteScenario: response to GET = ${scenariosArray}`);
										res.status(200).send(scenariosArray).end();
										db.close();
									})
									.catch(err => {
										winston.error(`RouteScenario: response to GET = ${err}`);
										res.status(500).send(err).end();
										db.close();
									});
							}
						});
					})
					.catch(err => {
						winston.info(err);
						res.status(500).send(err).end;
					});
			} else {
				res.status(401).send('access denied').end();
			}
		}); 

	webServer
		.post('/scenario',(req, res) => {
			var user = req.user;
			if (req.isAuthenticated()) {
				MongoClient.connect(dbUrl)
					.then(db => {
						db.collection('scenario', (err, scenarioCollection) => {
							if (err) {
								res.status(404).send(err).end();
							} else {
								var newScenario = {};
								newScenario = req.body;
								if (newScenario._id === null || newScenario._id === undefined) {
									newScenario._id = new ObjectID();
								} else {
									newScenario._id = new ObjectID(newScenario._id);
								}
								if (newScenario.uid === null || user.uid === undefined) {
									newScenario.uid = new ObjectID(user._id);
								} else {
									newScenario.uid = new ObjectID(newScenario.uid);
								}
								scenarioCollection.findOneAndReplace({_id:newScenario._id},newScenario, {upsert:true})
									.then(savedScenario => {
										res.status(200).send(savedScenario).end();
										db.close();
									})
									.catch(err => {
										winston.error(err);
										res.status(500).send(err).end();
										db.close();
									});
							}
						});
					})
					.catch(err => {
						winston.error(err);
						res.status(500).send(err).end();
					});
			} else {
				res.status(401).send('access denied').end();
			}
		});
};