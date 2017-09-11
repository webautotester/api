const winston = require('winston');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;




module.exports.init = function(serverNames, webServer) {
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
};
