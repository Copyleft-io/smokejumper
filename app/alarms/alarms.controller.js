'use strict';

app.controller("AlarmsCtrl", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Alarms) {

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

});

console.log('--> smokejumper/app/alarms/alarms.controller.js loaded');
