var app = angular.module('quakemon');

app.controller('homeCtrl', function($scope, homeService, authService, earthquakes){
  
  var userLoggedIn = authService.getUser(); 

  $scope.earthquakes = earthquakes;
  
  $scope.getDataLastHour = function(){
    homeService.getHourlyData().then(function(res){
      if (res.length === 0){
        $scope.noQuake = "No earthquakes recorded in the last hour.";
      } else {
        $scope.earthquakes = res;
      }
      $scope.updateTime = Date.now();
    })
  }

  setInterval(function(){
  $scope.getDataLastHour();
  }, 20000);



  $scope.getDataLastHourLoggedIn = function(){
    homeService.getHourlyDataLoggedIn().then(function(res){
      console.log('logged in control res: ', res)
      $scope.headerData = res.metadata;
      if (res.features.length === 0){
        $scope.noQuake = "No earthquakes recorded in the last hour.";
      } else {
        $scope.earthquakes = res.features;
      }
      console.log(res.features.length);
      $scope.updateTime = Date.now();
    })
  }

  // if (!userLoggedIn){
  //   console.log('user is not logged in');
  //   $scope.getDataLastHour();
  //   setInterval(function(){
  //     $scope.getDataLastHour();
  //   }, 20000);
  // } else if (userLoggedIn){
  //   console.log('user is logged in');
  //   $scope.getDataLastHourLoggedIn();
  //   setInterval(function(){
  //     $scope.getDataLastHourLoggedIn();
  //   }, 20000);
  // }

})