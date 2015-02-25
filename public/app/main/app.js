var app = angular.module('quakemon', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('/', {
      url: '/',
      templateUrl: '/app/templates/home/home-view.html',
      controller: 'homeCtrl',
      resolve: {
        user: function(authService){
          return authService.updateUser()
        },
        earthquakes: function(homeService, user){
          return homeService.getHourlyData(user);
        }
      }
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: '/app/templates/dashboard/dashboard-view.html',
      controller: 'dashboardCtrl',
      resolve: {
        user: function(authService){
          return authService.updateUser()
        }
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: '/app/templates/utility/privacy.html'
    })
    $urlRouterProvider.otherwise("/");
})