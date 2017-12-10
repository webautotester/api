const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;



const ObjectID = require('mongodb').ObjectID;

function init (serverNames, webServer, db, logger) {
	webServer.use(passport.initialize());

	var jwtOptions = {};
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
		var user = {
			username : req.body.username,
			password : req.body.password
		};
		db.collection('user', (err, userCollection) => {
			if (err) {
				logger.error(err);
				res.status(404).json({message:JSON.stringify(err)});
			} else {
				userCollection.findOne(user)
					.then( foundUser => {
						if (foundUser) {
							var payload = {_id: foundUser._id, username: foundUser.username};
							var token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn:'4h'});
							res.json({message: 'user authenticated!', username: foundUser.username, jwt: token});
						} else {
							logger.info('user not found');
							res.status(401).json({message:'user not found'});
						}
					})
					.catch(err => {
						logger.error(err);
						res.status(404).json({message:JSON.stringify(err)});
					});
			}
		});
	});

	webServer.post('/api/signin', (req, res) => {
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
						} else {
							userCollection.save(newUser).then(savedUser => {
								res.send(savedUser).end();
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

	webServer.get('/api/logout', (req, res)=> {
		req.logOut();
		req.session = null;
		res.status(200).json({status: 'Success'});
		//res.status(200).clearCookie('session', {path: '/'}).json({status: 'Success'});
	});
}

module.exports.init = init;