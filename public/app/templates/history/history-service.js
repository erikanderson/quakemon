var app = angular.module('quakemon');

app.service('historyService', function($http, $q){
  
  this.getData = function(timeFrame){
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: '/api/data/' + timeFrame
    }).then(function(res){
      console.log('in history service, getting data for ' + timeFrame);
      console.log(res);
      dfd.resolve(res.data.features);
    })
    return dfd.promise;
  }

})