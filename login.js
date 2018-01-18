const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

const crypto = require('crypto');
const sha256 = require('js-sha256');

const winston = require('winston');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;




const ObjectID = require('mongodb').ObjectID;

function init (serverNames, webServer, db, logger) {
	webServer.use(passport.initialize());

	let jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = 'watSecretKeyIsVeryVerySecret';

	var strategy = new JwtStrategy(jwtOptions,
		(jwtPayload, done) => {
			logger.info('payload received',jwtPayload); 
			db.collection('user', (err, userCollection) => {
				if (err) {
					logger.error(err);
					return done(err);
				} else {
					userCollection.findOne({_id:new ObjectID(jwtPayload._id)})
						.then( foundUser => {
							if (foundUser) {
								return done(null, foundUser);
							} else {
								logger.info('user not found');
								return done(null, false, {message:'Incorrect Login/Password'});
							}
						})
						.catch(err => {
							logger.error(err);
							return done(err);
						});
				}
			});
		});
	
	passport.use(strategy);
    
	webServer.post('/api/login', (req, res) => {
		let username = req.body.username;
		let password = req.body.password;
		db.collection('user', (err, userCollection) => {
			if (err) {
				logger.error(err);
				res.status(404).json({message:JSON.stringify(err)});
			} else {
				userCollection.findOne({type : 'wat', username : username})
					.then( foundUser => {
						if (checkAuthentication(foundUser, username, password)) {
							var payload = {_id: foundUser._id, username: foundUser.username};
							var token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn:'4h'});
							res.json({message: 'user authenticated!', username: foundUser.username, jwt: token});
						} else {
							logger.info('wrong username / password');
							res.status(401).json({message:'wrong username / password'});
						}
					})
					.catch(err => {
						logger.error(err);
						res.status(404).json({message:JSON.stringify(err)});
					});
			}
		});
	});

	function checkAuthentication(user, username, password) {
		if (user.username !== username) return false;

		hash = sha256(password+user.salt);
		if (user.hash !== hash) return false;

		return true;
	}

	webServer.post('/api/signup', (req, res) => { 
		//winston.info('signup');
		db.collection('user', (err, userCollection) => {
			if (err) {
				//winston.error(err);
				res.status(404).send(err).end();
			} else {
				let salt = crypto.randomBytes(256).toString('hex');
				let saltPassword = req.body.password + salt;
				let hash = sha256(saltPassword);
				let newUser = {
					_id : ObjectID(),
					type : 'wat',
					username : req.body.username,
					salt : salt,
					hash : hash
				};
				userCollection.findOne({type : 'wat', username: newUser.username})
					.then( (user) => {
						if (user) {
							var HTTP_CONFLIT = 409;
							res.status(HTTP_CONFLIT).send(user).end();
						} else {
							userCollection.save(newUser).then(savedUser => {
								res.send({id:savedUser._id, username:savedUser.username}).end();
							}).catch(err => {
								res.status(500).send(err).end();
							});
						}
					})
					.catch( (err) => {
						res.status(500).send(err).end();
					});
			}
		});
	});

	if (process.env.NODE_ENV === "PROD") {

		let gitHubStrategyOptions = {};
		gitHubStrategyOptions.clientID = process.env.GITHUB_CLIENT_ID;
		gitHubStrategyOptions.clientSecret = process.env.GITHUB_CLIENT_SECRET;
		gitHubStrategyOptions.callbackURL =  "https://wat.promyze.com/api/github/callback";

		logger.info("PROD");
		logger.info(JSON.stringify(gitHubStrategyOptions));

		/*let gitHubStrategy = new GitHubStrategy(gitHubStrategyOptions,
			(accessToken, refreshToken, profile, done) => {
				db.collection('user', (err, userCollection) => {
					if (err) {
						//winston.error(err);
						return done(err, null);
					} else {
						let newUser = {
							type : 'github',
							accessToken : accessToken,
							refreshToken : refreshToken,
							gitHubID : profile.id,
							gitHubEmail : profile.email
						};
						userCollection.findOne({type: 'github', gitHubID: newUser.gitHubID})
							.then( (user) => {
								if (user) {
									newUser._id = user._id;
									userCollection.save(newUser)
									.then(savedUser => {
										done(null,newUser);
									})
									.catch(err => {
										done(err,null);
									});
								} else {
									newUser._id = ObjectID();
									userCollection.save(newUser)
									.then(savedUser => {
										done(null,newUser);
									})
									.catch(err => {
										done(err,null);
									});
								}
							})
							.catch( (err) => {
								done(err,null);
							});
					}
				})
			});

		passport.use(gitHubStrategy);


		webServer.get('/api/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

		webServer.get(
			'/api/github/callback',
			passport.authenticate('github', { failureRedirect: '/login' }),
			function(req, res) {
				// Successful authentication, redirect home.
				res.redirect('/');
			}
		);*/
	} else {
		logger.info("DEBUG mode !");
	}
}

module.exports.init = init;