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
var textCtrl = require('./lib/controllers/text-control');

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
  failureRedirect: '/auth/failure', successRedirect: '/#/dashboard'
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


//Fetching data from USGS in geoJSON format

var hourlyData, dailyData, weeklyData, monthlyData;

//hourly
function getHourlyData(){
    Request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson', function(error, response, body){
      console.log('body.length: '. body.length)
      if (error || body.length == [230-240]){
        return false;
      }
      console.log('DATA FETCHED FOR HOUR');
      var parsed = JSON.parse(body);
      hourlyData = parsed;
    });
}
setTimeout(getHourlyData, 2000);
setInterval(getHourlyData, 60000);
App.get('/api/data/hourly', function(req, res){
    console.log('Client is getting hourly data');
    res.send(hourlyData);
})

//daily
function getDailyData(){
    Request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson', function(error, response, body){
      console.log('body.length: '. body.length)
      if (error || body.length == [230-240]){
        return false;
      }
      console.log('DATA FETCHED FOR DAY');
      dailyData = JSON.parse(body);
    })
}
setTimeout(getDailyData, 4000);
setInterval(getDailyData, 3600000);
App.get('/api/data/daily', function(req, res){
    console.log('Client is getting daily data');
    res.send(dailyData);
})

//weekly
function getWeeklyData(){
    Request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson', function(error, response, body){
      console.log('body.length: '. body.length)
      if (error || body.length == [230-240]){
        return false;
      }
      console.log('DATA FETCHED FOR WEEK');
      weeklyData = JSON.parse(body);
    })
}
setTimeout(getWeeklyData, 6000);
setInterval(getWeeklyData, 700000);
App.get('/api/data/weekly', function(req, res){
    console.log('Client is getting weekly data');
    res.send(weeklyData);
})


//monthly
function getMonthlyData(){
    Request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson', function(error, response, body){
      console.log('body.length: '. body.length)
      if (error || body.length == [230-240]){
        return false;
      }
      console.log('DATA FETCHED FOR MONTH');
      monthylData = JSON.parse(body);
    })
}
setTimeout(getMonthlyData, 8000);
setInterval(getMonthlyData, 900000);
App.get('/api/data/monthly', function(req, res){
    console.log('Client is getting monthly data');
    res.send(monthlyData);
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
  if(hourlyData){
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
           if (distance < usersArr[i].emailDistance && magnitude > usersArr[i].emailMagnitude){
            console.log(distance);
            User.update({_id: usersArr[i]._id}, {lastEmailAlertSent: Date.now()}, function(err, results){
              console.log(results);
            })
            emailCtrl.sendMail(distance, magnitude, usersArr[i].email);
           }
         }
      }
    };
  })
  }
}

setInterval(sendEmailAlerts, 30000);

  function sendTextAlerts(){
    if(hourlyData){
    User.find({}, function(err, users){
      var featuresData = hourlyData.features;
      var usersArr = users;
      var timeInMs = Date.now();
      for (var i = 0; i < usersArr.length; i++) {
        console.log('text in first for');
        if (usersArr[i].cell && usersArr[i].textAlertActive && (timeInMs - usersArr[i].lastTextAlertSent) > usersArr[i].textFrequency) {
          console.log('text in first if');
          for (var k = 0; k < featuresData.length; k++) {
            console.log('text in second for');
            var distance = parseInt(distanceCalc(usersArr[i].latitude, usersArr[i].longitude, featuresData[k].geometry.coordinates[1], featuresData[k].geometry.coordinates[0]));
            console.log(featuresData[k].properties.mag);
            var magnitude = featuresData[k].properties.mag;
            if (distance < usersArr[i].emailDistance && magnitude > usersArr[i].textMagnitude){
              console.log('text in second if');
              console.log('********* text alert is being sent**********');
              User.update({_id: usersArr[i]._id}, {lastTextAlertSent: Date.now()}, function(err, results){
                console.log(results);
              })
              textCtrl.sendText(usersArr[i].cell, distance, magnitude)
            }
          }
        }
      }
    })
    }
  }

setInterval(sendTextAlerts, 20000);

Mongoose.connect(Config.database, function(){
  console.log('Connected to MongoDB at: ' + Config.database);
})

App.listen(Config.port, function(){
  console.log('Now listening on port: ' + Config.port);
});
