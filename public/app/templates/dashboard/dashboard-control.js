var app = angular.module('quakemon');

app.controller('dashboardCtrl', function($scope, $interval, dashboardService, authService, user){
 
 $scope.updateZipData = $scope.user.zip;
 $scope.latitude = $scope.user.latitude;
 $scope.longitude = $scope.user.longitude;

 $scope.monitorDistance = $scope.user.monitorDistance;
 $scope.monitorMagnitude = $scope.user.monitorMagnitude;

 $scope.updateEmailData = $scope.user.email;
 $scope.emailDistance = $scope.user.emailDistance;
 $scope.emailMagnitude = $scope.user.emailMagnitude;
 $scope.updateEmailFrequency = $scope.user.emailFrequency;
 $scope.emailAlertActive = $scope.user.emailAlertActive;

 $scope.updateTextData = $scope.user.cell;
 $scope.textDistance = $scope.user.textDistance;
 $scope.updateTextMagnitude = $scope.user.textMagnitude;
 $scope.updateTextFrequency = $scope.user.textFrequency;
 $scope.textAlertActive = $scope.user.textAlertActive;
 
 console.log('Dashboard control user monitor distance is: ', user.monitorDistance);

  var updateUser = function(){
    authService.updateUser()
      .then(function(data){
        $scope.user = data;
        console.log('DASHBOARD USER UPDATE: ', $scope.user);
      })
  }

  $scope.updateDashboard = function(){
    dashboardService.updateDashboard(
      $scope.user._id, 
      $scope.updateZipData,
      $scope.monitorDistance,
      $scope.monitorMagnitude, 
      $scope.emailDistance, 
      $scope.emailMagnitude, 
      $scope.updateEmailData, 
      $scope.emailAlertActive, 
      $scope.updateEmailFrequency, 
      $scope.updateTextData, 
      $scope.textAlertActive, 
      $scope.updateTextFrequency, 
      $scope.updateTextMagnitude,
      $scope.textDistance
    ).then(function(res){
      console.log(res);
      if (res.status === 200 && !res.data.zipError) {
        $scope.errorMsg = '';
        $scope.successMsg = 'User successfully updated';
        updateUser();
      } else if (res.status === 500){
        $scope.successMsg = '';
        $scope.errorMsg = 'There was an error updating user';
      } else if (res.status === 200 && res.data.zipError){
        $scope.successMsg = '';
        $scope.errorMsg = 'ZIP code not found in database. Please try again or enter another ZIP that is close to you';
      }
    })
  }

  var logger = function(){
    console.log('Dashboard control user monitor distance is: ', $scope.user.monitorDistance);
  }

  // $interval(updateUser, 1000);

  // $interval(logger, 5000);
  //   setInterval(function(){
  //    console.log('Dashboard control user monitor distance is: ', $scope.user.monitorDistance);
  // }, 5000);

})