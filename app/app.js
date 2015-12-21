'use strict';

var app = angular.module('smokejumper', ['firebase','angular-md5','ui.router', 'ngTable', 'textAngular'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'static/home.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('dashboard');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('login', {
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardCtrl as dashboardCtrl',
        templateUrl: 'dashboard/dashboard.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          },
          dashboard: function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('about', {
        url: '/about',
        templateUrl: 'static/about.html'
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'users/profile.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('alarms', {
        url: '/alarms',
        controller: 'AlarmsCtrl as alarmsCtrl',
        templateUrl: 'alarms/index.html',
        resolve: {
          alarms: function (Alarms){
             return Alarms();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('alarms/create', {
        url: '/alarms/create',
        templateUrl: 'alarms/create.html',
        controller: 'AlarmsCtrl as alarmsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('alarms/view', {
        url: '/alarms/view/{alarmId}',
        templateUrl: 'alarms/view.html',
        controller: 'AlarmsCtrl as alarmsCtrl'
      })
      .state('alarms/edit', {
        url: '/alarms/edit/{alarmId}',
        templateUrl: 'alarms/edit.html',
        controller: 'AlarmsCtrl as alarmsCtrl'
      });
    $urlRouterProvider.otherwise('/');
  })
.constant('FIREBASE_URL', 'https://smokejumper.firebaseio.com/');
/*.constant('FIREBASE_URL', 'https://edo-basestation-dev.firebaseio.com/');*/
console.log('--> smokejumper/app/app.js loaded');
