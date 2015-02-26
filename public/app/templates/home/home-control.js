var app = angular.module('quakemon');

app.controller('homeCtrl', function($scope, homeService, authService, earthquakes, user){
  
  $scope.showTime = false;
  $scope.earthquakes = earthquakes;
  $scope.noQuake = earthquakes.message;
  
  $scope.getDataLastHour = function(user){
    homeService.getHourlyData(user).then(function(res){
      if (res.length === 0){
        $scope.noQuake = "No earthquakes recorded in the last hour.";
      } else {
        console.log(res);
        $scope.earthquakes = res;
      }
      $scope.updateTime = Date.now();
    })
  }

  setInterval(function(){
  $scope.getDataLastHour(user);
  }, 10000);
})