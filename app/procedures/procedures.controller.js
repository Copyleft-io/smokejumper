'use strict';

app.controller("ProceduresCtrl", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Procedures) {

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

});

console.log('--> smokejumper/app/procedures/procedures.controller.js loaded');
