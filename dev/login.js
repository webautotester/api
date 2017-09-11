const winston = require('winston');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;





module.exports.init = function(serverNames, webServer) {
    const dbUrl = `mongodb://${serverNames.mongoServerName}:27017/wat_storage`;
    webServer.use(passport.initialize());
    webServer.use(passport.session());
    //webServer.use(webServer.router);

    passport.use(new LocalStrategy(
        (username, password, done) => {
            return done(null, false, {message: 'Incorrect username.'});
        }
    ))
    
    webServer.post('/login',
        passport.authenticate('local',
        { successRedirect: '/',
          failureRedirect:'/login' })
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
                            winston.info(`user already recorded: ${JSON.stringify(user)}`);
                            res.status(HTTP_CONFLIT).send(user).end();
                        } else {
                            winston.info(`recording new user: ${JSON.stringify(newUser)}`);
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
                    })
				}
			});
		}).catch(err => {
			winston.info(err);
			res.status(500).send(err).end;
		});

    });
};
