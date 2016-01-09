'use strict';

var app = angular.module('smokejumper', ['firebase','angular-md5','ui.bootstrap','ui.router', 'ngTable', 'textAngular'])
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
      .state('logout', {
        url: '/logout',
        templateUrl: 'static/home.html',
        resolve: {
          requireNoAuth: function($state, Auth) {
            Auth.$unauth();
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
      .state('directory', {
        url: '/directory',
        controller: 'DirectoryCtrl as directoryCtrl',
        templateUrl: 'directory/index.html',
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
      .state('directory/user', {
        url: '/directory/user/{userId}',
        templateUrl: 'directory/view.html',
        controller: 'DirectoryCtrl as directoryCtrl'
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
      })
      .state('fires', {
        url: '/fires',
        controller: 'FiresCtrl as firesCtrl',
        templateUrl: 'fires/index.html',
        resolve: {
          fires: function (Fires){
             return Fires();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('fires/create', {
        url: '/fires/create',
        templateUrl: 'fires/create.html',
        controller: 'FiresCtrl as firesCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('fires/view', {
        url: '/fires/view/{fireId}',
        templateUrl: 'fires/view.html',
        controller: 'FiresCtrl as firesCtrl'
      })
      .state('fires/edit', {
        url: '/fires/edit/{fireId}',
        templateUrl: 'fires/edit.html',
        controller: 'FiresCtrl as firesCtrl'
      })
      .state('procedures', {
        url: '/procedures',
        controller: 'ProceduresCtrl as proceduresCtrl',
        templateUrl: 'procedures/index.html',
        resolve: {
          procedures: function (Procedures){
             return Procedures();
           },
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('procedures/create', {
        url: '/procedures/create',
        templateUrl: 'procedures/create.html',
        controller: 'ProceduresCtrl as proceduresCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }
        }
      })
      .state('procedures/view', {
        url: '/procedures/view/{procedureId}',
        templateUrl: 'procedures/view.html',
        controller: 'ProceduresCtrl as proceduresCtrl'
      })
      .state('procedures/edit', {
        url: '/procedures/edit/{procedureId}',
        templateUrl: 'procedures/edit.html',
        controller: 'ProceduresCtrl as proceduresCtrl'
      });
    $urlRouterProvider.otherwise('/');
  })
.constant('FIREBASE_URL', 'https://smokejumper.firebaseio.com/');
/*.constant('FIREBASE_URL', 'https://edo-basestation-dev.firebaseio.com/');*/
console.log('--> smokejumper/app/app.js loaded');
