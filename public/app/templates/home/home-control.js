var app = angular.module('quakemon');

app.controller('homeCtrl', function($scope, $interval, homeService, authService, earthquakes, user){
  
  $scope.showTime = false;
  $scope.processing = false;
  $scope.earthquakes = earthquakes;
  $scope.noQuake = earthquakes.message;
  
  $scope.getDataLastHour = function(user){
    homeService.getHourlyData(user).then(function(res){
      if (res.length === 0){
        $scope.noQuake = "No earthquakes recorded in the last hour.";
        //console.log('Home Control user is: ', user);
      } else {
        //console.log('HOME USER MONITOR DISTANCE: ', user.monitorDistance)
        $scope.earthquakes = res;
      }
      $scope.updateTime = Date.now();
    })
  }

  // $interval($scope.getDataLastHour(user), 5000);

  setInterval(function(){
  $scope.getDataLastHour(user);
  }, 10000);

})