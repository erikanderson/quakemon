var app = angular.module('quakemon');

app.controller('homeCtrl', function($scope, homeService, authService, earthquakes, user){
  

  $scope.earthquakes = earthquakes;
  
  $scope.getDataLastHour = function(user){
    homeService.getHourlyData(user).then(function(res){
      if (res.length === 0){
        $scope.noQuake = "No earthquakes recorded in the last hour.";
      } else {
        $scope.earthquakes = res;
      }
      $scope.updateTime = Date.now();
    })
  }

  // $scope.getDataLastHour(user);

  setInterval(function(){
  console.log('Injected user: ', user);
  }, 10000);

  setInterval(function(){
  $scope.getDataLastHour(user);
  }, 20000);

  // var user = authService.getUser();

  // $scope.getDataLastHourLoggedIn = function(){
  //   homeService.getHourlyDataLoggedIn().then(function(res){
  //     console.log('logged in control res: ', res)
  //     $scope.headerData = res.metadata;
  //     if (res.features.length === 0){
  //       $scope.noQuake = "No earthquakes recorded in the last hour.";
  //     } else {
  //       $scope.earthquakes = res.features;
  //     }
  //     console.log(res.features.length);
  //     $scope.updateTime = Date.now();
  //   })
  // }

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