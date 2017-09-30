const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');



function init (serverNames, webServer, db) {
	webServer
		.get('/api/run/scenario/:sid', (req, res) => {
			//winston.info(`GET /run/${req.params.sid}`);
			var sidID = new ObjectID(req.params.sid);
			const N = 10;
			if (req.isAuthenticated()) {
				db.collection('run', {strict:true}, (err, runCollection) => {
					if (err) {
						res.status(404).send(err).end();
					} else {
						//winston.info(JSON.stringify(sidID));
						var cursor = runCollection.find({sid:sidID, read:false});
						//winston.info('Got Run Cursor');
						cursor.count()
							.then( count => {
								//winston.info(`Count ${count} runs`);
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
			} else {
				res.status(401).send('access denied').end();
			}
		})
		.get('/api/run/user/:uid', (req, res) => {
			//winston.info(`GET /run/${req.params.sid}`);
			var uidID = new ObjectID(req.params.uid);
			if (req.isAuthenticated()) {
				db.collection('run', {strict:true}, (err, runCollection) => {
					if (err) {
						res.status(404).send(err).end();
					} else {
						//winston.info(JSON.stringify(sidID));
						runCollection.find({uid:uidID, read:false}).toArray()
							.then(runsArray => {
								res.status(200).send(runsArray).end();
							})
							.catch(err => {
								res.status(500).send(err).end();
							});
					}
				});
			} else {
				res.status(401).send('access denied').end();
			}
		});

	webServer
		.delete('/api/run/:rid',(req, res) => {
			if (req.isAuthenticated()) {
				db.collection('run', {strict:true}, (err, runCollection) => {
					if (err) {
						//winston.info('Collection run not created yet !');
						res.status(404).send(err).end();
					} else {
						runCollection.remove({_id:new ObjectID(req.params.rid)})
							.then(() => {
								//winston.info('RouteRun: response to Delete ');
								res.status(200).send().end();
							})
							.catch(err => {
								//winston.error(`RouteRun: response to Delete = ${err}`);
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