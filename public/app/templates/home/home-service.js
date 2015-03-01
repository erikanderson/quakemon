var app = angular.module('quakemon');

 
app.service('homeService', function($http, $q, authService){

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

  this.getHourlyData = function(user){
    if (!user) {
      console.log('NO USER');
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/data/hourly'
      }).then(function(res){
        console.log('gethourlydata res: ', res.data.features);
        if (res.data.features.length === 0){
          //console.log('no earthquakes');
          res.data.features.message = "No earthquakes recorded in the last hour";
        }
        deferred.resolve(res.data.features);
      })
    } else if (user){
      console.log('USER LOGGED IN');
      var latitude1 = user.latitude;
      var longitude1 = user.longitude;
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/data/hourly'
      }).then(function(res){
        // console.log('//////// userCalc: ', userCalc);
        // console.log('******* api data: ', res);
        for (var i = 0; i < res.data.features.length; i++) {
          var latitude2 = res.data.features[i].geometry.coordinates[1];
          var longitude2 = res.data.features[i].geometry.coordinates[0];
          // console.log('in for loop: ', latitude2, longitude2);
          var distanceToUser = distanceCalc(latitude1, longitude1, latitude2, longitude2);
          res.data.features[i].distanceToUser = distanceToUser;
          // console.log(res.data.features[i].distanceToUser);
        }
        console.log('Logged in data: ', res.data.features);
        if (res.data.features.length === 0){
          console.log('no earthquakes');
          res.data.features.message = "No earthquakes recorded in the last hour";
        }
        deferred.resolve(res.data.features);
      })
    }
    return deferred.promise;
  }
})
















