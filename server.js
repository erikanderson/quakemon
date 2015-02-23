var Express = require('express');
var App = Express();
var Passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var BodyParser = require('body-parser');
var Session  = require('express-session');
var Mongoose = require('mongoose');
var Config = require('./config');
var Morgan = require('morgan');
var Request = require('Request');
var Https = require('https');
var Http = require('http');
var fs = require('fs');

//controllers



var userCtrl = require('./lib/controllers/user-control');

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
App.use(Session({ secret: Config.session_secret }));
App.use(Passport.initialize());
App.use(Passport.session());
// App.use(Morgan('dev'));

Passport.use(new GoogleStrategy({
  clientID: Config.google_client_id,
  clientSecret: Config.google_client_secret,
  callbackURL: Config.callback
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
  // console.log('******** /auth/me **********');
  return res.json(req.user);
});

//endpoints
App.put('/api/users/:id', userCtrl.put);


//testing USGS geojson

var hourlyData;
counter = 0;

function getHourlyData(){
  Request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson', function(error, response, body){
    // console.log('served request at ', Date.now());
    // console.log('/////////// fetched geojson data ////////////');
    hourlyData = body;
    // console.log(hourlyData);
    // console.log('****************************');
    // console.log('++++++++++ ' + counter + ' ++++++++++++++');
    counter ++;
    // return hourlyData;
  })
}

getHourlyData();

setInterval(getHourlyData, 20000);

App.get('/api/data', function(req, res){
    res.send(hourlyData);
})

//zip testing 

// var Zip = require('./lib/models/zip');
// Zip.findOne({_id: '07722'}, 'loc', function(err, loc){
//   console.log('loc: ', loc);
// });


//twillio testing 

// Twilio Credentials 
var accountSid = 'ACfcdfe0c7200797bbbf956f456ebe223c'; 
var authToken = 'ba67926e1e4aa1dbfc136fb32f79abde'; 
 
//require the Twilio module and create a REST client 
// Twilio Credentials 
var accountSid = 'ACfcdfe0c7200797bbbf956f456ebe223c'; 
var authToken = 'ba67926e1e4aa1dbfc136fb32f79abde'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
// client.messages.create({ 
//   to: "7327579649", 
//   from: "+17323911035", 
//   body: "TROGDOR",   
// }, function(err, message) { 
//   console.log(message.sid); 
// });

//connections

Mongoose.connect(Config.database, function(){
  console.log('Connected to MongoDB at: ' + Config.database);
})

App.listen(Config.port, function(){
  console.log('Now listening on port: ' + Config.port);
});
