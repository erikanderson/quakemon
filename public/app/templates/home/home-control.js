var app = angular.module('quakemon');

app.controller('homeCtrl', function($scope, homeService, authService){
  
  var userLoggedIn = authService.getUser(); 
  
  $scope.getDataLastHour = function(){
    homeService.getHourlyData().then(function(res){
      $scope.headerData = res.metadata;
      $scope.earthquakes = res.features;
      $scope.updateTime = Date.now();
    })
  }

  $scope.getDataLastHourLoggedIn = function(){
    homeService.getHourlyDataLoggedIn().then(function(res){
      console.log('logged in control res: ', res)
      $scope.headerData = res.metadata;
      $scope.earthquakes = res.features;
      $scope.updateTime = Date.now();
    })
  }

  if (!userLoggedIn){
    console.log('user is not logged in');
    $scope.getDataLastHour();
    setInterval(function(){
      $scope.getDataLastHour();
    }, 20000);
  } else if (userLoggedIn){
    console.log('user is logged in');
    $scope.getDataLastHourLoggedIn();
    setInterval(function(){
      $scope.getDataLastHourLoggedIn();
    }, 20000);
  }
})