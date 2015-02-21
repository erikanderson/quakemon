var app = angular.module('quakemon');

app.controller('homeCtrl', function($scope, homeService){

  $scope.getDataLastHour = function(){
    homeService.getHourlyData().then(function(res){
      // console.log('res: ',res);
      // console.log('res.metadata: ',res.metadata);
      $scope.headerData = res.metadata;
      // console.log('res.features: ',res.features);

      $scope.earthquakes = res.features;
      $scope.updateTime = Date.now();
    })
  }
  $scope.getDataLastHour();
  
  setInterval(function(){
    $scope.getDataLastHour();
  }, 20000);
})