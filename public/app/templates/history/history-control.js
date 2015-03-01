var app = angular.module('quakemon');

app.controller('historyCtrl', function($scope, $filter, earthquakesHistory){
  

  $scope.processing = false;

  $scope.greaterThan = function(prop, val){
    return function(item){
      return item[prop] > val;
    }
  }

  $scope.earthquakesHistory = earthquakesHistory;
})