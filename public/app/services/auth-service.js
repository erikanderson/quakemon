var app = angular.module('quakemon');

app.service('authService', function($http){

  var user = {};

  this.updateUser = function(){
    return $http({
      method: 'GET',
      url: '/auth/me'
    }).then(function(res){
      user = res.data;
      console.log("AUTH SERVICE DISTANCE: ", user.monitorDistance);
      return user;
    })
  }

  this.getUser = function(){
    return user;
  }

  this.logout = function(){
    return $http({
      method: 'GET',
      url: '/auth/logout'
    }).then(function(res){
      return res.data;
    })
  }

})