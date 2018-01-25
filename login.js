const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');
const session = require('express-session');

const crypto = require('crypto');
const sha256 = require('js-sha256');

const winston = require('winston');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const GitHubStrategy = require('passport-github2').Strategy;
const axios = require('axios');



const ObjectID = require('mongodb').ObjectID;

function init (serverNames, webServer, db, logger) {
	if (process.env.NODE_ENV === "PROD") {
		webServer.use(session({secret:process.env.SESSION_KEY, resave: false, saveUninitialized: false}));
	}
	webServer.use(passport.initialize());
	if (process.env.NODE_ENV === "PROD") {
		webServer.use(passport.session());
	}

	setJWTStrategy(serverNames, webServer, db, logger);
	setJWTRoute(serverNames, webServer, db, logger);

	if (process.env.NODE_ENV === "PROD") {
		setGitHubOAuthStrategy(serverNames, webServer, db, logger);
		setGitHubOAuthRoute(serverNames, webServer, db, logger);
	}
}

function setJWTStrategy(serverNames, webServer, db, logger) {
	let jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = process.env.JWT_SECRET;

	var strategy = new JwtStrategy(jwtOptions,
		(jwtPayload, done) => {
			logger.info('payload received',jwtPayload); 
			db.collection('user', (err, userCollection) => {
				if (err) {
					logger.error(err);
					return done(err);
				} else {
					userCollection.findOne({username:jwtPayload.username})
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
}

function setJWTRoute(serverNames, webServer, db, logger) {
	let jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = process.env.JWT_SECRET;
	
	webServer.post('/api/login', (req, res) => {
		let username = req.body.username;
		let password = req.body.password;
		db.collection('user', (err, userCollection) => {
			if (err) {
				logger.error('error in collection');
				logger.error(err);
				res.status(404).json({message:JSON.stringify(err)});
			} else {
				logger.info(`username=${username}`);
				userCollection.findOne({type : 'wat', username : username})
					.then( foundUser => {
						logger.info(`user: ${JSON.stringify(foundUser)}`);
						if (checkAuthentication(foundUser, username, password)) {
							logger.info(`authentication is checked`);
							var payload = {username: foundUser.username};
							logger.info(`payload:${payload}`);
							var token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn:'4h'});
							logger.info(`token:${token}`);
							res.json({message: 'user authenticated!', username: foundUser.username, jwt: token});
						} else {
							logger.info('wrong username / password');
							res.status(401).json({message:'wrong username / password'});
						}
					})
					.catch(err => {
						logger.error('error in find user');
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
}

function setGitHubOAuthStrategy(serverNames, webServer, db, logger) {
	let gitHubStrategyOptions = {};
	gitHubStrategyOptions.clientID = process.env.GITHUB_CLIENT_ID;
	gitHubStrategyOptions.clientSecret = process.env.GITHUB_CLIENT_SECRET;
	gitHubStrategyOptions.callbackURL =  "https://wat.promyze.com/api/github/callback";

	let gitHubStrategy = new GitHubStrategy(gitHubStrategyOptions,
		(accessToken, refreshToken, profile, done) => {
			logger.info(`GitHubOAuth Callback : ${JSON.stringify(profile)}`);
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
						username : profile.username
					};
					logger.info(`GitHub New User ? ${JSON.stringify(newUser)}`);
					saveOrUpdateGitHubUser(userCollection, newUser)
						.then(savedUser => {
							done(null,newUser);
						})
						.catch( err => {
							done(err,null);
						})
				}
			});
		});

	passport.use(gitHubStrategy);

	passport.serializeUser(function(user, done) {
		done(null, user);
	});
	  
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});
}

function setGitHubOAuthRoute(serverNames, webServer, db, logger  ) {
	webServer.get('/api/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

	webServer.get(
		'/api/github/callback',
		passport.authenticate('github', { failureRedirect: '/login' }),
		function(req, res) {
			res.status(302).location('/github');
			res.end();
			// Successful authentication, redirect home.
		}
	);

	webServer.get(
		'/api/github/jwt',
		(req, res) => {
			if (req.isAuthenticated()) {
				logger.info(`authenticated:${JSON.stringify(req.user)}`);
				let token = createJWT(req.user.username);
				res.json({message: 'user authenticated!', username: req.user.username, jwt: token});
			} else {
				res.status(401).json({message:'wrong username / password'});
			}
		}
	);

	webServer.post(
		'/api/github/plugin',
		(req, res) => {
			let newUser = {
				type : 'github',
			};
			let code = req.body.code;
			logger.info(`code:${code}`);
			getGitHubAccessToken(code, logger)
				.then( accessToken => {
					logger.info(`accessToken:${accessToken}`);
					newUser.accessToken = accessToken;
					return getGitHubUser(accessToken, logger);;
				})
				.then( gitHubProfile => {
					newUser.gitHubID = gitHubProfile.gitHubID;
					newUser.username = gitHubProfile.username;
					logger.info(`profile:${JSON.stringify(gitHubProfile)}`);
					return db.collection('user');
				})
				.then( userCollection => {
					return saveOrUpdateGitHubUser(userCollection, newUser);
				})
				.then ( saveUser => {
					logger.info(`save:${JSON.stringify(saveUser)}`);
					let token = createJWT(newUser.username);
					res.json({message: 'user authenticated!', username: newUser.username, jwt: token});
				})
				.catch(err => {
					logger.info(`err:${JSON.stringify(err)}`);
					res.status(401).json({message:'wrong GitHub authentication'});
				})
		}
	);
}


function saveOrUpdateGitHubUser(userCollection, newUser) {
	return userCollection.findOne({type: 'github', gitHubID: newUser.gitHubID})
		.then( (user) => {
			if (user) {
				newUser._id = user._id;
			} else {
				newUser._id = ObjectID();
			}
			return userCollection.save(newUser)
		});
}
		

function createJWT(username) {
	let payload = {username: username};
	return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'4h'});
}

function getGitHubAccessToken(code, logger) {
	const url = 'https://github.com/login/oauth/access_token';
	let parameters = {
		client_id : process.env.PLUGIN_CLIENT_ID,
		client_secret : process.env.PLUGIN_CLIENT_SECRET,
		code : code
	}
	logger.info(`getGitHubAccessToken: ${JSON.stringify(parameters)}`);
	return axios.post(url, parameters, {headers: {'accept': 'application/json'}})
		.then( response => {
			logger.info(`getGitHubAccessToken: ${JSON.stringify(response.data)}`);
			if (response.data.access_token) {
				logger.info(`getGitHubAccessToken, access_token: ${response.data.access_token})`);
				return Promise.resolve(response.data.access_token);
			} else {
				logger.info(`getGitHubAccessToken, error: ${response.data.error_description})`);
				return Promise.reject(response.data.error_description)
			}
		});
}

function getGitHubUser(accessToken, logger) {
	const url = 'https://api.github.com/user';
	logger.info(`getGitHubUser: ${accessToken}`);
	return axios.get(url, {headers: {'Authorization': `token ${accessToken}`}})
		.then( response => {
			logger.info(JSON.stringify(response.data));
			if (response.data.login && response.data.id) {
				return Promise.resolve({username: response.data.login, gitHubID: response.data.id});
			} else {
				return Promise.reject('no profile');
			}
		});
}

module.exports.init = init;