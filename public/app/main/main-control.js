var app = angular.module('quakemon');

app.controller('mainCtrl', function($scope, authService){

  var updateUser = function(){
    console.log('test');
    authService.updateUser()
      .then(function(data){
        $scope.user = data;
        console.log($scope.user);
      })
  }

  updateUser();

  $scope.logout = function(){
    authService.logout()
      .then(function(data){
        updateUser();
      })
  }

})