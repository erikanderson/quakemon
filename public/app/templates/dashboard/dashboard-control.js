var app = angular.module('quakemon');

app.controller('dashboardCtrl', function($scope, dashboardService, authService){
 
  var updateUser = function(){
    console.log('test');
    authService.updateUser()
      .then(function(data){
        $scope.user = data;
        console.log($scope.user);
      })
  }


  $scope.updateZip = function(){
    console.log('scope user id', $scope.user._id);
    dashboardService.put($scope.user._id, $scope.updateZipData)
      .then(function(res){
        console.log(res);
        if (res.status === 200){
          console.log('Updated ZIP', res);
          $scope.updateZipData = '';
          updateUser();
        }
      })
  }
})