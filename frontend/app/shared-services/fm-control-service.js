'use strict';

angular.module('app').factory('FMService',['$http','notify','serverBaseUrl', function($http,notify,serverBaseUrl) {
  return {

  turnOn : function(plug){
    $http.put(serverBaseUrl+'/plug/status', {"status": "1","plug":plug}).
      success(function(data, status, headers, config) {
            notify.closeAll();
            notify('On');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
         notify('Error');
      })
      },
  turnOff : function(plug){
    $http.put(serverBaseUrl+'/plug/status', {"status": "0","plug":plug}).
      success(function(data, status, headers, config) {
        notify.closeAll();
         notify('Off');
        //TODO
      }).
      error(function(data, status, headers, config) {
      notify.closeAll();
       notify('Error');
        //TODO
      })
      }


    }


}]);
