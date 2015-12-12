'use strict';
app.controller('ProfileCtrl', function($state, Auth, md5, auth, profile){
    var profileCtrl = this;
    profileCtrl.profile = profile;
    profileCtrl.updateProfile = function(){
      profileCtrl.profile.email = auth.password.email;
      profileCtrl.profile.emailHash = md5.createHash(auth.password.email);
      profileCtrl.profile.$save().then(function(){
        $state.go('channels');
      });
    };
    profileCtrl.logout = function(){
      profileCtrl.profile.online = null;
      profileCtrl.profile.$save().then(function(){
        Auth.$unauth();
        $state.go('home');
      });
    };
  });

console.log('--> basestation/app/users.profile.js loaded');
