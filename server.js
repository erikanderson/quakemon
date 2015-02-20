var Express = require('express');
var App = Express();
var Passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var BodyParser = require('body-parser');
var Session  = require('express-session');
var Mongoose = require('mongoose');
var Config = require('./config');

//controllers


var userCtrl = require('./server-assets/controllers/user-control');

//middleware

Passport.serializeUser(function(user, done){
  done(null, user);
});

Passport.deserializeUser(function(obj, done){
  userCtrl.getUser(obj.id).then(function(results){
    done(null, results);
  }, function(err){
    done(err, null);
  })
});


App.use(Express.static(__dirname + '/public'));
App.use(BodyParser.json());
App.use(Session({ secret: config.session_secret }));
App.use(Passport.initialize());
App.use(Passport.session());


Passport.use(new GoogleStrategy({
  clientID: config.google_client_id,
  clientSecret: config.google_client_secret,
  callbackURL: 'http://localhost:8080/auth/google/callback'
}, function(token, tokenSecret, profile, done){
  userCtrl.updateOrCreate(profile).then(function(results){
    done(null, profile);
  }, function(err){
    done(err, profile);
  })
}));



//authentication

App.get('/auth/google', Passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

App.get('/auth/google/callback', Passport.authenticate('google', {
  failureRedirect: '/auth/failure', successRedirect: '/'
}));

App.get('/auth/logout', function(req, res){
  req.logout();
  res.status(200).json(req.user);
})

App.get('/auth/me', function(req, res){
  return res.json(req.user);
});

//endpoints
App.put('/api/users/:id', userCtrl.put);


//connections

Mongoose.connect(mongoURI, function(){
  console.log('Connected to MongoDB at: ' + mongoURI);
})

App.listen(port, function(){
  console.log('Now listening on port: ' + port);
});