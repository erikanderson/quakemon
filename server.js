var Express = require('express');
var App = Express();
var Passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var BodyParser = require('body-parser');
var Session  = require('express-session');
var Mongoose = require('mongoose');
var Config = require('./config');
var Morgan = require('morgan');
var Request = require('request');
var User = require('./lib/models/user');

//controllers

var userCtrl = require('./lib/controllers/user-control');
var emailCtrl = require('./lib/controllers/email-control');

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
  console.log('******** /auth/me **********');
  return res.json(req.user);
});

//endpoints

var requireAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        console.log('USER NOT AUTHENTICATED');
        return res.status(401).end();
    }
    console.log('USER IS AUTHENTICATED');
    return next();
};

App.put('/api/users/:id', requireAuth, userCtrl.put);


//testing USGS geojson

var hourlyData;
counter = 0;
function getHourlyData(){
  Request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson', function(error, response, body){
    hourlyData = JSON.parse(body);
    console.log('counter is at: ', counter);
    console.log('********* USGS data: ', hourlyData);
    console.log(hourlyData.features.length);
    counter ++;
  })
}
getHourlyData();
setInterval(getHourlyData, 55000);
App.get('/api/data', function(req, res){
    res.send(hourlyData);
})


var distanceCalc = function(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}  

function sendEmailAlerts(){
  User.find({} ,function(err, users){
    var featuresData = hourlyData.features;
    var usersArr = users;
    var timeInMs = Date.now();
    // console.log('users: ', users);
    for (var i = 0; i < usersArr.length; i++) {
      console.log('time in MS: ', timeInMs);
      console.log('last email alert sent: ', usersArr[i].lastEmailAlertSent);
      if (usersArr[i].emailAlertActive && (timeInMs - usersArr[i].lastEmailAlertSent) > usersArr[i].emailFrequency) {
        for (var k = 0; k < featuresData.length; k++) {
           var distance = parseInt(distanceCalc(usersArr[i].latitude, usersArr[i].longitude, featuresData[k].geometry.coordinates[1], featuresData[k].geometry.coordinates[0]));
           console.log(featuresData[k].properties.mag);
           var magnitude = featuresData[k].properties.mag;
           if (distance < usersArr[i].warningDistanceThreshold && magnitude > usersArr[i].warningMagnitudeThreshold){
            console.log(distance);
            console.log('da quake is near and email alert is being sent');
            User.update({_id: usersArr[i]._id}, {lastEmailAlertSent: Date.now()}, function(err, results){
              console.log(results);
            })
            emailCtrl.sendMail(distance, magnitude);
           }
         }
      }
    };  
  })
}


setInterval(sendEmailAlerts, 20000);



Mongoose.connect(Config.database, function(){
  console.log('Connected to MongoDB at: ' + Config.database);
})

App.listen(Config.port, function(){
  console.log('Now listening on port: ' + Config.port);
});
