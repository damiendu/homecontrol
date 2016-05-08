'use strict';

angular.module('app').factory('AlarmService',['$http','notify','serverBaseUrl', function($http,notify,serverBaseUrl) {

    return {
      getAlarms:  function(params,callback){
        return $http.get(serverBaseUrl+'/alarms'+params).
          success(function(data, status, headers, config) {
            if(callback){
             callback(data);
            }
          }).
          error(function(data, status, headers, config) {
            notify("An error occured on server please contact administrator");
          })
        },
        deleteAlarm : function(alarm,callback){
        $http.delete(serverBaseUrl+'/alarms/'+ alarm.id).
          success(function(data, status, headers, config) {
            if(callback){
             callback(data);
            }
            notify("This alarm is deleted but will keep ringing until you save");
          }).
          error(function(data, status, headers, config) {
            notify("An error occured on server please contact administrator");
          })
          },
        saveAlarms : function(params,alarms,callback){
            $http.put(serverBaseUrl+'/alarms'+params, alarms).
              success(function(data, status, headers, config) {
                if(callback){
                 callback(data);
                }
                notify("Alarms are now set");
              }).
              error(function(data, status, headers, config) {
                notify("An error occured on server please contact administrator");
              })
          }
  };


}]);
