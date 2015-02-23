var app = angular.module('quakemon');

app.service('dashboardService', function($http, $q){
  this.put = function(id, zip){
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
})


// mongoimport --db quakemon --collection zips zips.json --jsonArray
