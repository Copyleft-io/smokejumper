'use strict';

app.factory("Fires", function FireFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'fires');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> smokejumper/app/fires/fires.service.js loaded');
