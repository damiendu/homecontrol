'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('app', [
  'ui.router','ngResource','cgNotify','toggle-switch','app.config'
]);

myApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('layout', {
      url: "/",
      templateUrl: "layout/layout.html",
      controller: "LayoutCtrl"
    })
    .state('layout.genericroom', {
      url: "genericroom",
      templateUrl: "generic-room/generic-room.html",
      controller: "GenericRoomCtrl"
    })
    ;
});
