'use strict';

angular.module('app').controller('LayoutCtrl', ['$scope','$state','HomeDefinitionService','MusicService',
function($scope,$state,HomeDefinitionService,MusicService) {
    $scope.homeDefinition = {};
    $scope.activeRoom = {};
    loadPlaylists();

    HomeDefinitionService.getHomeDefinition(function(data){
            $scope.homeDefinition = data;
            $scope.activeRoom = $scope.homeDefinition.rooms[0];
            $state.go("layout.genericroom");
    });

    $scope.goToRoom = function(room){
        $scope.activeRoom=room;
        $state.go("layout.genericroom");
    };

    function loadPlaylists(){
       MusicService.getGlobalPlaylists(function(data){
            $scope.globalPlaylists = data;
       });
    }

}]);