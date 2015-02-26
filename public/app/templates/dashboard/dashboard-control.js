var app = angular.module('quakemon');

app.controller('dashboardCtrl', function($scope, dashboardService, authService){
 
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


  var updateUser = function(){
    console.log('test');
    authService.updateUser()
      .then(function(data){
        $scope.user = data;
        console.log($scope.user);
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
        updateUser();
      } else if (res.status === 200 && res.data.zipError){
        $scope.successMsg = '';
        $scope.errorMsg = 'ZIP code not found in database. Please try again or enter another ZIP that is close to you';
        updateUser();
      }
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
    dashboardService.updateThresholds($scope.user._id, $scope.emailDistance, $scope.emailMagnitude)
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

  $scope.updateText = function(){
    dashboardService.updateText($scope.user._id, $scope.updateTextData, $scope.textAlertActive, $scope.updateTextFrequency, $scope.updateTextMagnitude)
      .then(function(res){
        console.log(res);
        updateUser();
      })
  }

})