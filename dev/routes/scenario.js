const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const passport = require('passport');

function init(serverNames, webServer, db, logger) {
	logger.info('record scenario');
	let router = express.Router();

	router.use(passport.authenticate('jwt', {session:false}));

	router
		.get('/',(req, res) => {
			logger.info('call scenario');
			var user = req.user;
			if (req.isAuthenticated()) {
				db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
					if (err) {
						logger.info('Collection scenarion not created yet !');
						res.status(404).send(err).end();
					} else {
						scenarioCollection.find({uid:new ObjectID(user._id)}).toArray()
							.then(scenariosArray => {
								logger.info(`RouteScenario: response to GET = ${scenariosArray}`);
								res.status(200).send(scenariosArray).end();
							})
							.catch(err => {
								logger.error(`RouteScenario: response to GET = ${err}`);
								res.status(500).send(err).end();
							});
					}
				});
			} else {
				res.status(401).send('access denied').end();
			}
		})
		.get('/:sid',(req, res) => {
			logger.info('call scenario');
			if (req.isAuthenticated()) {
				db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
					if (err) {
						logger.info('Collection scenario not created yet !');
						res.status(404).send(err).end();
					} else {
						scenarioCollection.find({_id:new ObjectID(req.params.sid)}).toArray()
							.then(scenariosArray => {
								logger.info(`RouteScenario: response to GET = ${scenariosArray}`);
								res.status(200).send(scenariosArray).end();
							})
							.catch(err => {
								logger.error(`RouteScenario: response to GET = ${err}`);
								res.status(500).send(err).end();
							});
					}
				});
			} else {
				res.status(401).send('access denied').end();
			}
		});

	router
		.post('/',(req, res) => {
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
								logger.error(err);
								res.status(500).send(err).end();
							});
					}
				});
			} else {
				res.status(401).send('access denied').end();
			}
		});
	
	router
		.delete('/:sid',(req, res) => {
			if (req.isAuthenticated()) {
				db.collection('scenario', {strict:true}, (err, scenarioCollection) => {
					if (err) {
						logger.info('Collection scenarion not created yet !');
						res.status(404).send(err).end();
					} else {
						scenarioCollection.remove({_id:new ObjectID(req.params.sid)})
							.then(() => {
								logger.info('RouteScenario: response to Delete ');
								res.status(200).send().end();
							})
							.catch(err => {
								logger.error(`RouteScenario: response to Delete = ${err}`);
								res.status(500).send(err).end();
							});
					}
				});					
			} else {
				res.status(401).send('access denied').end();
			}
		}); 

	webServer.use('/api/scenario', router);
		
}


module.exports.init = init;