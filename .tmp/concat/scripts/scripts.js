'use strict';

var app = angular.module('smokejumper', ['firebase','angular-md5','ui.router', 'ngTable', 'textAngular'])
  .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'static/home.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('dashboard');
            }, function(error){
              return;
            });
          }]
        }
      })
      .state('login', {
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            });
          }]
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            });
          }]
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardCtrl as dashboardCtrl',
        templateUrl: 'dashboard/dashboard.html',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }],
          dashboard: ["Users", "Auth", function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }]
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
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }],
          profile: ["Users", "Auth", function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }]
        }
      })
      .state('alarms', {
        url: '/alarms',
        controller: 'AlarmsCtrl as alarmsCtrl',
        templateUrl: 'alarms/index.html',
        resolve: {
          alarms: ["Alarms", function (Alarms){
             return Alarms();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('alarms/create', {
        url: '/alarms/create',
        templateUrl: 'alarms/create.html',
        controller: 'AlarmsCtrl as alarmsCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
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
  }])
.constant('FIREBASE_URL', 'https://smokejumper.firebaseio.com/');
/*.constant('FIREBASE_URL', 'https://edo-basestation-dev.firebaseio.com/');*/
console.log('--> smokejumper/app/app.js loaded');

'use strict';
app.factory('Auth', ["$firebaseAuth", "FIREBASE_URL", function($firebaseAuth, FIREBASE_URL){
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    return auth;
  }]);
console.log('--> smokejumper/app/auth/auth.service.js loaded');  

'use strict';
app.controller('AuthCtrl', ["Auth", "$state", function(Auth, $state){
    var authCtrl = this;

    authCtrl.user = {
      email: '',
      password: ''
    };

    authCtrl.login = function (){
      Auth.$authWithPassword(authCtrl.user).then(function (auth){
        $state.go('home');
      }, function (error){
        authCtrl.error = error;
      });
    };

    authCtrl.register = function (){
      Auth.$createUser(authCtrl.user).then(function (user){
        authCtrl.login();
      }, function (error){
        authCtrl.error = error;
      });
    };

  }]);
  console.log('--> smokejumper/app/auth/auth.controller.js loaded');

'use strict';
app.factory('Users', ["$firebaseArray", "$firebaseObject", "FIREBASE_URL", function($firebaseArray, $firebaseObject, FIREBASE_URL){
    var usersRef = new Firebase(FIREBASE_URL+'users');
    var connectedRef = new Firebase(FIREBASE_URL+'.info/connected');
    var users = $firebaseArray(usersRef);
    var Users = {
      getProfile: function(uid){
        return $firebaseObject(usersRef.child(uid));
      },
      getDisplayName: function(uid){
        return users.$getRecord(uid).displayName;
      },
      getGravatar: function(uid){
        return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
      },
      setOnline: function(uid){
        var connected = $firebaseObject(connectedRef);
        var online = $firebaseArray(usersRef.child(uid+'/online'));

        connected.$watch(function (){
          if(connected.$value === true){
            online.$add(true).then(function(connectedRef){
              connectedRef.onDisconnect().remove();
            });
          }
        });
      },
      all: users
    };

    return Users;
  }]);
  console.log('--> smokejumper/app/users/users.service.js loaded');

'use strict';
app.controller('ProfileCtrl', ["$state", "Auth", "md5", "auth", "profile", function($state, Auth, md5, auth, profile){
    var profileCtrl = this;
    profileCtrl.profile = profile;
    profileCtrl.updateProfile = function(){
      profileCtrl.profile.email = auth.password.email;
      profileCtrl.profile.emailHash = md5.createHash(auth.password.email);
      profileCtrl.profile.$save().then(function(){
        $state.go('profile');
      });
    };
    profileCtrl.logout = function(){
      profileCtrl.profile.online = null;
      profileCtrl.profile.$save().then(function(){
        Auth.$unauth();
        $state.go('home');
      });
    };
  }]);

console.log('--> smokejumper/app/users.profile.js loaded');

'use strict';

app.controller('DashboardCtrl', ["$state", "md5", "auth", function($state, md5, auth){
    var DashboardCtrl = this;

  }]);

console.log('--> smokejumper/app/dashboard/dashboard.controller.js loaded');

'use strict';

app.factory("Alarms", ["FIREBASE_URL", "$firebaseArray", function AlarmFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'alarms');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> smokejumper/app/alarms/alarms.service.js loaded');

'use strict';

app.controller("AlarmsCtrl", ["$state", "$scope", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Alarms", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Alarms) {

    $scope.alarms = Alarms();

    // add a new alarm
    $scope.create = function(alarm) {
      $scope.alarms.$add(alarm).then(function() {
        console.log('alarm Created');
        //$location.path('/alarms');
        $state.go('alarms');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // remove an alarm
    $scope.delete = function(alarm) {
        $scope.alarms.$remove(alarm).then(function(){
            console.log('alarm Deleted');
            //$scope.tableAlarms.reload();
        }).catch(function(error){
            console.log(error);
        });
    };

    // getAlarm on init for /alarms/edit/:id route
    $scope.getAlarm = function() {
      var ref = new Firebase(FIREBASE_URL + 'alarms');
      $scope.alarm = $firebaseObject(ref.child($stateParams.alarmId));
    };

    // update a alarm and save it
    $scope.update = function() {
      // save firebaseObject
      $scope.alarm.$save().then(function(){
        console.log('alarm Updated');
        // redirect to /alarm path after update
        //$location.path('/alarms');
        $state.go('alarms');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.alarms.$loaded().then(function(alarms) {
      console.log(alarms.length); // data is loaded here
      var data = alarms;

      $scope.tableAlarms = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: { title: 'asc' }    // initial sorting
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('filter')(data, params.filter()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    });

    // Listening for list updates to Alarms to update Table
    var ref = new Firebase(FIREBASE_URL + 'alarms');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.alarms.$loaded().then(function(){
        $scope.tableAlarms.reload();
      });
    });

    // Listening for Child removed
    //
    //var ref = new Firebase(FIREBASE_URL + 'environments');
    // $scope.environments.on('child_removed', function() {
    //   console.log('/environments child removed');
    //    $scope.tableEnvironments.reload();
    //  });



     // logs { event: "child_removed", key: "foo" }
    //  list.$remove({
    //    console.log('Environments List Updated... List Item Added');
    //  });

     // logs { event: "child_added", key: "<new _id>", prevId: "<prev_id>" }
    //  list.$add({
    //    console.log('Environments List Updated... List Item Removed');
    //  });

}]);

console.log('--> smokejumper/app/alarms/alarms.controller.js loaded');
