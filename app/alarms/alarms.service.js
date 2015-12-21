'use strict';

app.factory("Alarms", function AlarmFactory(FIREBASE_URL, $firebaseArray) {
  return function(){
    // snapshot of our data
    var ref = new Firebase(FIREBASE_URL + 'alarms');
    // returning synchronized array
    return $firebaseArray(ref);
  }
});

console.log('--> smokejumper/app/alarms/alarms.service.js loaded');
