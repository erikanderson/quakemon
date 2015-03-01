var app = angular.module('quakemon');

app.controller('monthlyCtrl', function($scope, monthly){
  $scope.monthlyEarthquakes = monthly;
})