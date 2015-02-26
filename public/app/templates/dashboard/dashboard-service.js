var app = angular.module('quakemon');

app.service('dashboardService', function($http, $q){

  this.updateDashboard = function(id, zip, mdist, mmag, edist, emag, email, ealert, efreq, cell, talert, tfreq, tmag, tdist) {
    var dfd = $q.defer();
    $http({
      method: 'PUT',
      url: '/api/users/' + id,
      data: {
        zip: zip,
        monitorDistance: mdist,
        monitorMagnitude: mmag,
        emailDistance: edist,
        emailMagnitude: emag,
        email: email,
        emailAlertActive: ealert,
        emailFrequency: efreq,
        cell: cell,
        textAlertActive: talert,
        textFrequency: tfreq,
        textMagnitude: tmag,
        textDistance: tdist,
        
      }
    }).then(function(res, data){
      dfd.resolve(res);
    })
    return dfd.promise;
  }

  
  this.updateZip = function(id, zip){
    console.log('dashboard service', id, zip)
    var dfd = $q.defer();
    $http({
      method: 'PUT', 
      url: '/api/users/' + id,
      data: {zip: zip}
    }).then(function(res, data){
      console.log('dashboard service res: ', res, data);
      dfd.resolve(res);
    })
    return dfd.promise;
  }

  this.updateThresholds = function(id, dist, mag){
    var dfd = $q.defer();
    $http({
      method: 'PUT',
      url: '/api/users/' + id,
      data: {emailDistance: dist, emailMagnitude: mag}
    }).then(function(res, data){
      dfd.resolve(res);
    })
    return dfd.promise;
  }

  this.updateEmail = function(id, email, alert, freq){
    var dfd = $q.defer();
    $http({
      method: 'PUT',
      url: '/api/users/' + id,
      data: {email: email, emailAlertActive: alert, emailFrequency: freq}
    }).then(function(res, data){
      dfd.resolve(res);
    })
    return dfd.promise;
  }

  this.updateText = function(id, cell, alert, freq, mag){
    var dfd = $q.defer();
    $http({
      method: 'PUT',
      url: '/api/users/' + id,
      data: {
        cell: cell,
        textAlertActive: alert,
        textFrequency: freq,
        textMagnitude: mag
      }
    }).then(function(res, data){
      dfd.resolve(res);
    })
    return dfd.promise;
  }

})




// mongoimport --db quakemon --collection zips zips.json --jsonArray
