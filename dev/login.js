const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;





module.exports.init = function(serverNames, webServer) {
	const dbUrl = `mongodb://${serverNames.mongoServerName}:27017/wat_storage`;
    
	webServer.use(passport.initialize());
	webServer.use(passport.session());

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser((_id,done) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('user', (err, userCollection) => {
				if (err) {
					return done(err);
				} else {
					userCollection.findOne({_id:new ObjectID(_id)})
						.then( foundUser => {
							if (foundUser) {
								return done(null, foundUser);
							} else {
								return done(null, false, {message:'Incorrect Login/Password'});
							}
						})
						.catch(err => {
							return done(err);
						});
				}
			});
		}).catch(err => {
			return done(err);
		});
	});

	passport.use(new LocalStrategy(
		(username, password, done) => {
			MongoClient.connect(dbUrl).then(db => {
				db.collection('user', (err, userCollection) => {
					if (err) {
						return done(err);
					} else {
						var user = {
							username : username,
							password : password
						};
						userCollection.findOne(user)
							.then( foundUser => {
								if (foundUser) {
									return done(null, foundUser);
								} else {
									return done(null, false, {message:'Incorrect Login/Password'});
								}
							})
							.catch(err => {
								return done(err);
							});
					}
				});
			}).catch(err => {
				return done(err);
			});
		}
	));


    
	webServer.post('/login',
		passport.authenticate('local'),
		(req, res) => {
			res.status(200).send(req.user).end();
		}
	);

	webServer.post('/signin', (req, res) => {
		MongoClient.connect(dbUrl).then(db => {
			db.collection('user', (err, userCollection) => {
				if (err) {
					res.status(404).send(err).end();
				} else {
					var newUser = {
						username : req.body.username,
						password : req.body.password,
						_id : ObjectID()
					};
					userCollection.findOne({username: newUser.username})
						.then( (user) => {
							if (user) {
								var HTTP_CONFLIT = 409;
								res.status(HTTP_CONFLIT).send(user).end();
								db.close();
							} else {
								userCollection.save(newUser).then(savedUser => {
									res.send(savedUser).end();
									db.close();
								}).catch(err => {
									res.status(500).send(err).end();
									db.close();
								});
							}
						})
						.catch( (err) => {
							res.status(500).send(err).end();
							db.close();
						});
				}
			});
		}).catch(err => {
			res.status(500).send(err).end;
		});

	});

	webServer.get('/logout', (req, res)=> {
		req.logOut();
		req.session = null;
		res.status(200).clearCookie('session', {path: '/'}).json({status: 'Success'});
	});
};
