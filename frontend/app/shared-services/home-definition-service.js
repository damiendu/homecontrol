'use strict';

angular.module('app').factory('HomeDefinitionService',['$http','notify','serverBaseUrl', function($http,notify,serverBaseUrl) {

    return {

  getHomeDefinition:  function(callback){
    return $http.get(serverBaseUrl+'/homedef').
      success(function(data, status, headers, config) {
        if(callback){
         callback(data);
        }
      }).
      error(function(data, status, headers, config) {
        notify("An error occured on server please contact administrator");
      })
    }


  };


}]);
