var app = angular.module('quakemon', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/app/templates/home/home-view.html',
      controller: 'homeCtrl'
    })
    .when('/dashboard', {
      templateUrl: '/app/templates/dashboard/dashboard-view.html',
      controller: 'dashboardCtrl',
      resolve: {
        user: function(authService){
          return authService.updateUser()
        }
      }
    })
    .otherwise('/');
})