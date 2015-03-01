var app = angular.module('quakemon');

app.service('monthlyService', function($http, $q){
  this.getMonthlyData = function(){
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: '/api/data/monthly'
    }).then(function(res){
      console.log(res.data.features.length);
      dfd.resolve(res.data.features);
    })
    return dfd.promise;
  }
})