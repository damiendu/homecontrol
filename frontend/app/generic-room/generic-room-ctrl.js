'use strict';

angular.module('app').controller('GenericRoomCtrl', ['$scope','MusicService','FMService','AlarmService','$interval','$stateParams',
function($scope,MusicService,FMService,AlarmService,$interval,$stateParams) {
    $scope.alarms=[];
    $scope.playlists=[];
    $scope.selectedPlaylist = "";

    $scope.$watch('activeRoom', function(activeRoom){
        if(activeRoom.music){
          MusicService.getPlaylists($scope.activeRoom.music.host,function(data){
            $scope.playlists=data;
            });

            MusicService.getCurrentPlayingFile($scope.activeRoom.music.host,function(data){
                    $scope.playingMusic = data;
                });

            if(!$scope.getPlayingMusicInterval){
                $scope.getPlayingMusicInterval = $interval(function(){
                    MusicService.getCurrentPlayingFile($scope.activeRoom.music.host,function(data){
                        $scope.playingMusic = data;
                    });
                }
                , 10000);
            }

            if(activeRoom.music.alarm){
                $scope.alarms = AlarmService.getAlarms('?host='+activeRoom.music.host,function(data){$scope.alarms=data;});
            }
        }



    })

    $scope.addAlarm= function(){
        var id = 0;
        if($scope.alarms.length>0){
            id=$scope.alarms[$scope.alarms.length-1].id+1
        }
        var newAlarm = {'id':id,'name':'New alarm','on':false,'hour':8,'min':0,'frequency':{},
        'host':$scope.activeRoom.music.host,'playlist':$scope.globalPlaylists[1].file,'lastTime':5,'on':true};
        $scope.alarms.push(newAlarm);
    };


    $scope.setSleepMusic = function(){
	   MusicService.setSleep($scope.activeRoom.music.host,$scope.activeRoom.music.plug,$scope.activeRoom.music.sleepMinutes);
    };

    $scope.saveAlarms= function(){
        AlarmService.saveAlarms('?host='+$scope.activeRoom.music.host,$scope.alarms);
    };

    $scope.removeAlarm= function(alarm){
        var id=0;
            for(var i =0;i<$scope.alarms.length;i++){
                if($scope.alarms[i].id===alarm.id){
                    id=i;
                    break;
                }
            }
            $scope.alarms.splice(id,1);
    };
    
    $scope.playPlaylist= function(playlist){
        MusicService.playPlaylist($scope.activeRoom.music.host,playlist);
    };

    $scope.turnOnMusic= function(){
        FMService.turnOn($scope.activeRoom.music.plug);
    };

    $scope.turnOffMusic= function(){
        MusicService.stop($scope.activeRoom.music.host);
        FMService.turnOff($scope.activeRoom.music.plug);
    };

    $scope.previousSong= function(){
        MusicService.playPrevious($scope.activeRoom.music.host);
    };

    $scope.playSong= function(){
        MusicService.playPause($scope.activeRoom.music.host);
    };

    $scope.pauseSong= function(){
        MusicService.playPause($scope.activeRoom.music.host);
    };

    $scope.stopSong= function(){
        MusicService.stop($scope.activeRoom.music.host);
    };

    $scope.nextSong= function(){
        MusicService.playNext($scope.activeRoom.music.host);
    };

    $scope.volumeUp= function(){
        MusicService.volumeUp($scope.activeRoom.music.host);
    };

    $scope.volumeDown= function(){
        MusicService.volumeDown($scope.activeRoom.music.host);
    };

    $scope.turnPlugOn= function(plug){
        FMService.turnOn(plug);
    };

    $scope.turnPlugOff= function(plug){
        FMService.turnOff(plug);
    };

}]);
