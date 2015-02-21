var app = angular.module('quakemon');

app.service('dashboardService', function($http){
  this.put = function(id, zip){
    console.log('dashboard service', id)
    return $http({
      method: 'PUT', 
      url: '/api/users/' + id,
      data: {zip: zip}
    })
  }
})


// mongoimport --db quakemon --collection zips zips.json --jsonArray
