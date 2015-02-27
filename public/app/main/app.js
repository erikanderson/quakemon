var app = angular.module('quakemon', ['ui.router', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('/', {
      url: '/',
      templateUrl: '/app/templates/home/home-view.html',
      controller: 'homeCtrl',
      resolve: {
        user: function(authService){
          console.log('home resolve for user is firing');
          return authService.updateUser()
        },
        earthquakes: function(homeService, user){
          console.log('home resolve for earthquakes is firing');
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
          console.log('dashboard resolve for user is firing');
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