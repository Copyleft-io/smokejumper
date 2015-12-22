'use strict';

app.factory("Procedures", function ProcedureFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'procedures');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> smokejumper/app/procedures/procedures.service.js loaded');
