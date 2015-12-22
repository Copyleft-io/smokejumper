'use strict';

app.controller("FiresCtrl", function($state, $scope, FIREBASE_URL, $firebaseObject, $firebaseArray, $stateParams, ngTableParams, $filter, Fires) {

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

});

console.log('--> smokejumper/app/fires/fires.controller.js loaded');
