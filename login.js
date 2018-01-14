const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

const crypto = require('crypto');
const sha256 = require('js-sha256');

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
		let username = req.body.username;
		let password = req.body.password;
		db.collection('user', (err, userCollection) => {
			if (err) {
				logger.error(err);
				res.status(404).json({message:JSON.stringify(err)});
			} else {
				userCollection.findOne({username : username})
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
		db.collection('user', (err, userCollection) => {
			if (err) {
				res.status(404).send(err).end();
			} else {
				let newUser = {
					_id : ObjectID(),
					username : req.body.username,
					salt : crypto.randomBytes(256).toString('hex'),
					hash : sha256(req.body.password+salt)
				};
				userCollection.findOne({username: newUser.username})
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

module.exports.init = init;