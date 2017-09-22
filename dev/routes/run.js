const ObjectID = require('mongodb').ObjectID;
const winston = require('winston');



function init (serverNames, webServer, db) {
	webServer
		.get('/api/run/:sid', (req, res) => {
			//winston.info(`GET /run/${req.params.sid}`);
			var sidID = new ObjectID(req.params.sid);
			const N = 10;
			if (req.isAuthenticated()) {
				db.collection('run', {strict:true}, (err, runCollection) => {
					if (err) {
						res.status(404).send(err).end();
					} else {
						//winston.info(JSON.stringify(sidID));
						var cursor = runCollection.find({sid:sidID});
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
		});
		
}

module.exports.init = init;