var app = angular.module('quakemon');

app.controller('dashboardCtrl', function($scope, dashboardService, authService){
 
 $scope.updateZipData = $scope.user.zip;
 $scope.updateDistanceThreshold = $scope.user.warningDistanceThreshold;
 $scope.updateMagnitudeThreshold = $scope.user.warningMagnitudeThreshold;
 $scope.updateEmailData = $scope.user.email;
 $scope.emailAlertActive = $scope.user.emailAlertActive;
 $scope.updateEmailFrequency = $scope.user.emailFrequency;


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
    dashboardService.updateZip($scope.user._id, $scope.updateZipData)
      .then(function(res){
        console.log(res);
        if (res.status === 200 && !res.data.zipError){
          console.log('Updated ZIP', res);
          $scope.zipError = '';
          $scope.zipSuccess = 'Zip code successfully updated';
          $scope.updateZipData = '';
          updateUser();
        } else if (res.status === 200 && res.data.zipError){
          console.log(res);
          $scope.zipSuccess = '';
          $scope.zipError = res.data.zipError;
          $scope.updateZipData = '';
        }
      })
  }

  $scope.updateThresholds = function(){
    dashboardService.updateThresholds($scope.user._id, $scope.updateDistanceThreshold, $scope.updateMagnitudeThreshold)
      .then(function(res){
        console.log(res);
        updateUser();
      })
  }

  $scope.updateEmail = function(){
    dashboardService.updateEmail($scope.user._id, $scope.updateEmailData, $scope.emailAlertActive, $scope.updateEmailFrequency)
      .then(function(res){
        console.log(res);
        updateUser();
      })
  }

})