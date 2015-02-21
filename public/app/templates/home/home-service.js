var app = angular.module('quakemon');

app.service('homeService', function($http, $q){
  this.getHourlyData = function(){
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/api/data'
    }).then(function(res){
      deferred.resolve(res.data);
    })
    return deferred.promise;
  }
})