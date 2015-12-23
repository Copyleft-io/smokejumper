'use strict';

var app = angular.module('smokejumper', ['firebase','angular-md5','ui.bootstrap','ui.router', 'ngTable', 'textAngular'])
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
      .state('directory', {
        url: '/directory',
        controller: 'DirectoryCtrl as directoryCtrl',
        templateUrl: 'directory/index.html',
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
      })
      .state('fires', {
        url: '/fires',
        controller: 'FiresCtrl as firesCtrl',
        templateUrl: 'fires/index.html',
        resolve: {
          fires: ["Fires", function (Fires){
             return Fires();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('fires/create', {
        url: '/fires/create',
        templateUrl: 'fires/create.html',
        controller: 'FiresCtrl as firesCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
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
          procedures: ["Procedures", function (Procedures){
             return Procedures();
           }],
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
        }
      })
      .state('procedures/create', {
        url: '/procedures/create',
        templateUrl: 'procedures/create.html',
        controller: 'ProceduresCtrl as proceduresCtrl',
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
              $state.go('home');
            });
          }]
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
app.controller('DirectoryCtrl', ["$state", "$scope", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Users", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Users){

    var usersRef = new Firebase(FIREBASE_URL+'users');
    $scope.users = $firebaseArray(usersRef);

    // getUser on /directory/user/view/:id route
    $scope.getUser = function() {
    var ref = new Firebase(FIREBASE_URL + 'users');
    $scope.user = $firebaseObject(ref.child($stateParams.userId));
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.users.$loaded().then(function(users) {
      console.log(users.length); // data is loaded here
      var data = users;

      $scope.tableDirectory = new ngTableParams({
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

    // Listening for list updates to Procedures to update Table
    var ref = new Firebase(FIREBASE_URL + 'users');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.users.$loaded().then(function(){
        $scope.tableDirectory.reload();
      });
    });

}]);

console.log('--> smokejumper/app/directory.controller.js loaded');

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

'use strict';

app.factory("Fires", ["FIREBASE_URL", "$firebaseArray", function FireFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'fires');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> smokejumper/app/fires/fires.service.js loaded');

'use strict';

app.controller("FiresCtrl", ["$state", "$scope", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Fires", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Fires) {

    $scope.fires = Fires();

    // add a new fire
    $scope.create = function(fire) {
      $scope.fires.$add(fire).then(function() {
        console.log('fire Created');
        //$location.path('/fires');
        $state.go('fires');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // remove an fire
    $scope.delete = function(fire) {
        $scope.fires.$remove(fire).then(function(){
            console.log('fire Deleted');
            //$scope.tableFires.reload();
        }).catch(function(error){
            console.log(error);
        });
    };

    // getFire on init for /fires/edit/:id route
    $scope.getFire = function() {
      var ref = new Firebase(FIREBASE_URL + 'fires');
      $scope.fire = $firebaseObject(ref.child($stateParams.fireId));
    };

    // update a fire and save it
    $scope.update = function() {
      // save firebaseObject
      $scope.fire.$save().then(function(){
        console.log('fire Updated');
        // redirect to /fire path after update
        //$location.path('/fires');
        $state.go('fires');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.fires.$loaded().then(function(fires) {
      console.log(fires.length); // data is loaded here
      var data = fires;

      $scope.tableFires = new ngTableParams({
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

    // Listening for list updates to Fires to update Table
    var ref = new Firebase(FIREBASE_URL + 'fires');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.fires.$loaded().then(function(){
        $scope.tableFires.reload();
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

console.log('--> smokejumper/app/fires/fires.controller.js loaded');

'use strict';

app.factory("Procedures", ["FIREBASE_URL", "$firebaseArray", function ProcedureFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'procedures');
    // returning synchronized array
    return $firebaseArray(ref);
  }
}]);

console.log('--> smokejumper/app/procedures/procedures.service.js loaded');

'use strict';

app.controller("ProceduresCtrl", ["$state", "$scope", "FIREBASE_URL", "$firebaseObject", "$firebaseArray", "$stateParams", "ngTableParams", "$filter", "Procedures", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Procedures) {

    $scope.procedures = Procedures();

    // add a new procedure
    $scope.create = function(procedure) {
      $scope.procedures.$add(procedure).then(function() {
        console.log('procedure Created');
        //$location.path('/procedures');
        $state.go('procedures');

      }).catch(function(error) {
        console.log(error);
      });
    };

    // remove an procedure
    $scope.delete = function(procedure) {
        $scope.procedures.$remove(procedure).then(function(){
            console.log('procedure Deleted');
            //$scope.tableProcedures.reload();
        }).catch(function(error){
            console.log(error);
        });
    };

    // getProcedure on init for /procedures/edit/:id route
    $scope.getProcedure = function() {
      var ref = new Firebase(FIREBASE_URL + 'procedures');
      $scope.procedure = $firebaseObject(ref.child($stateParams.procedureId));
    };

    // update a procedure and save it
    $scope.update = function() {
      // save firebaseObject
      $scope.procedure.$save().then(function(){
        console.log('procedure Updated');
        // redirect to /procedure path after update
        //$location.path('/procedures');
        $state.go('procedures');
      }).catch(function(error){
        console.log(error);
      });
    };

    // Since the data is asynchronous we'll need to use the $loaded promise.
    // Once data is available we'll set the data variable and init the ngTable
    $scope.procedures.$loaded().then(function(procedures) {
      console.log(procedures.length); // data is loaded here
      var data = procedures;

      $scope.tableProcedures = new ngTableParams({
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

    // Listening for list updates to Procedures to update Table
    var ref = new Firebase(FIREBASE_URL + 'procedures');
    var list = $firebaseArray(ref);
    list.$watch(function(event) {
      console.log(event);
      $scope.procedures.$loaded().then(function(){
        $scope.tableProcedures.reload();
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

console.log('--> smokejumper/app/procedures/procedures.controller.js loaded');
