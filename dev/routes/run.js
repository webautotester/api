const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const passport = require('passport');

function init (serverNames, webServer, db, logger) {
	let router = express.Router();
	router.use(passport.authenticate('jwt', {failureRedirect: '/login' , session:false}));

	router
		.get('/scenario/:sid', (req, res) => {
			logger.info(`GET /run/${req.params.sid}`);
			var sidID = new ObjectID(req.params.sid);
			const N = 10;
			db.collection('run', {strict:true}, (err, runCollection) => {
				if (err) {
					res.status(404).send(err).end();
				} else {
					logger.info(JSON.stringify(sidID));
					var cursor = runCollection.find({sid:sidID, read:false});
					logger.info('Got Run Cursor');
					cursor.count()
						.then( count => {
							logger.info(`Count ${count} runs`);
							if (count > N) {
								return cursor.skip(count - N).toArray();
							} else {
								return cursor.toArray();
							}
						})
						.then(runsArray => {
							res.status(200).send(runsArray).end();
						})
						.catch(err => {
							res.status(500).send(err).end();
						});
				}
			});
		})
		.get('/user/:uid', (req, res) => {
			logger.info(`GET /run/${req.params.sid}`);
			var uidID = new ObjectID(req.params.uid);
			db.collection('run', {strict:true}, (err, runCollection) => {
				if (err) {
					res.status(404).send(err).end();
				} else {
					logger.info(JSON.stringify(sidID));
					runCollection.find({uid:uidID, read:false}).toArray()
						.then(runsArray => {
							res.status(200).send(runsArray).end();
						})
						.catch(err => {
							res.status(500).send(err).end();
						});
				}
			});
		});

	router
		.delete('/:rid',(req, res) => {
			db.collection('run', {strict:true}, (err, runCollection) => {
				if (err) {
					logger.info('Collection run not created yet !');
					res.status(404).send(err).end();
				} else {
					runCollection.remove({_id:new ObjectID(req.params.rid)})
						.then(() => {
							logger.info('RouteRun: response to Delete ');
							res.status(200).send().end();
						})
						.catch(err => {
							logger.error(`RouteRun: response to Delete = ${err}`);
							res.status(500).send(err).end();
						});
				}
			});					
		}); 

	webServer.use('/api/run', router);
}

module.exports.init = init;