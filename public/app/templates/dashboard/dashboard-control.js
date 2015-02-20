var app = angular.module('quakemon');

app.controller('dashboardCtrl', function($scope, user){
  $scope.test = 'Testing Dashboard CTRL';

  $scope.user = user;
})