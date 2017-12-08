const winston = require('winston');
const ObjectID = require('mongodb').ObjectID;

function init(serverNames, webServer, db) {
	//winston.info('record scenario');
	webServer
		.get('/api/scenario',(req, res) => {
			//winston.info('call scenario');
			var user = req.user;
			if (req.isAuthenticated()) {
				db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
					if (err) {
						//winston.info('Collection scenarion not created yet !');
						res.status(404).send(err).end();
					} else {
						scenarioCollection.find({uid:new ObjectID(user._id)}).toArray()
							.then(scenariosArray => {
								//winston.info(`RouteScenario: response to GET = ${scenariosArray}`);
								res.status(200).send(scenariosArray).end();
							})
							.catch(err => {
								//winston.error(`RouteScenario: response to GET = ${err}`);
								res.status(500).send(err).end();
							});
					}
				});
			} else {
				res.status(401).send('access denied').end();
			}
		})
		.get('/api/scenario/:sid',(req, res) => {
			//winston.info('call scenario');
			if (req.isAuthenticated()) {
				db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
					if (err) {
						//winston.info('Collection scenario not created yet !');
						res.status(404).send(err).end();
					} else {
						scenarioCollection.find({_id:new ObjectID(req.params.sid)}).toArray()
							.then(scenariosArray => {
								//winston.info(`RouteScenario: response to GET = ${scenariosArray}`);
								res.status(200).send(scenariosArray).end();
							})
							.catch(err => {
								//winston.error(`RouteScenario: response to GET = ${err}`);
								res.status(500).send(err).end();
							});
					}
				});
			} else {
				res.status(401).send('access denied').end();
			}
		});

	webServer
		.post('/api/scenario',(req, res) => {
			var user = req.user;
			if (req.isAuthenticated()) {
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
							})
							.catch(err => {
								//winston.error(err);
								res.status(500).send(err).end();
							});
					}
				});
			} else {
				res.status(401).send('access denied').end();
			}
		});
	
	webServer
		.delete('/api/scenario/:sid',(req, res) => {
			if (req.isAuthenticated()) {
				db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
					if (err) {
						//winston.info('Collection scenarion not created yet !');
						res.status(404).send(err).end();
					} else {
						scenarioCollection.remove({_id:new ObjectID(req.params.sid)})
							.then(() => {
								//winston.info('RouteScenario: response to Delete ');
								res.status(200).send().end();
							})
							.catch(err => {
								//winston.error(`RouteScenario: response to Delete = ${err}`);
								res.status(500).send(err).end();
							});
					}
				});					
			} else {
				res.status(401).send('access denied').end();
			}
		}); 
		
}


module.exports.init = init;