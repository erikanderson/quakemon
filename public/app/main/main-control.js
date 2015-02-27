var app = angular.module('quakemon');

app.controller('mainCtrl', function($scope, $interval, authService){

  var updateUser = function(){
    authService.updateUser()
      .then(function(data){
        $scope.user = data;
        //console.log($scope.user);
      })
  }
  updateUser();
  $interval(updateUser, 3000);

  $scope.logout = function(){
    authService.logout()
      .then(function(data){
        updateUser();
      })
  }

})