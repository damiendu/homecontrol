'use strict';

angular.module('app').factory('MusicService',['$http','notify','serverBaseUrl', function($http,notify,serverBaseUrl) {

    return {

  playNext : function(room){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc":"2.0","method":"Player.GoTo","id":1,"params":{"playerid":0,"to":"next"}}}).
      success(function(data, status, headers, config) {
        notify.closeAll();
        notify('next');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
      },
  shutdown: function(room){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc":"2.0","method":"System.Shutdown","id":1}}).
      success(function(data, status, headers, config) {
         notify.closeAll();
         notify('shuting down');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
      },
  playPlaylist: function(room,playlist){
    $http.post(serverBaseUrl+'/music',
    {room:room , jsonToSend:{"jsonrpc":"2.0","id":1,"method":"Player.Open","params":{"item":{"directory":playlist},"options":{"shuffled":true}}}}).
      success(function(data, status, headers, config) {
        notify.closeAll();
        notify('playing : '+ playlist);
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
      },
  playPrevious : function(room){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc":"2.0","method":"Player.GoTo","id":1,"params":{"playerid":0,"to":"previous"}}}).
      success(function(data, status, headers, config) {
        notify.closeAll();
        notify('previous');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
      },
  playPause : function(room){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc":"2.0","method":"Player.PlayPause","id":1,"params":{"playerid":0}}}).
      success(function(data, status, headers, config) {
        notify.closeAll();
        notify('play/pause');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
    },
  stop : function(room){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc":"2.0","method":"Player.Stop","id":1,"params":{"playerid":0}}}).
      success(function(data, status, headers, config) {
        notify.closeAll();
        notify('stop');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
    },
  getGlobalPlaylists : function(callback){
    $http.get(serverBaseUrl+'/music/playlists').
      success(function(data, status, headers, config) {
        var objectReturned = data;
        try{
            objectReturned = JSON.parse(data);
        }catch(e){}

        if(objectReturned.result && objectReturned.result.files){
             callback(objectReturned.result.files);
        }else{
            callback([]);
        }

      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
  },
  getPlaylists : function(room,callback){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": {"directory":"/storage/music", "media":"files"}, "id": "1"}}).
      success(function(data, status, headers, config) {
        var objectReturned = data;
        try{
            objectReturned = JSON.parse(data);
        }catch(e){}

        if(objectReturned.result && objectReturned.result.files){
             callback(objectReturned.result.files);
        }else{
            callback([]);
        }

      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
  },
  volumeUp : function(room){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc": "2.0", "method": "Application.SetVolume", "id": "1", "params": {"volume": "increment"}}}).
      success(function(data, status, headers, config) {
         notify.closeAll();
         notify('volume up');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
    },
  volumeDown : function(room){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc": "2.0", "method": "Application.SetVolume", "id": "1", "params": {"volume": "decrement"}}}).
       success(function(data, status, headers, config) {
        notify.closeAll();
         notify('volume down');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })
    },
   setSleep : function(host,plug,minutes){
	$http.post(serverBaseUrl+'/music/sleep',
    {host:host,plug:plug,sleepMinutes:minutes}).
       success(function(data, status, headers, config) {
        notify.closeAll();
         notify('sleep set');
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error');
      })


   },
    getCurrentPlayingFile : function(room,callback){
    $http.post(serverBaseUrl+'/music',
    {room:room,jsonToSend:{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 0 }, "id": "AudioGetItem"}}).
       success(function(data, status, headers, config) {
         var objectReturned = data;
        try{
            objectReturned = JSON.parse(data);
        }catch(e){}

        if(objectReturned.result && objectReturned.result.item){
             callback(objectReturned.result.item);
        }else{
            callback();
        }
      }).
      error(function(data, status, headers, config) {
        notify.closeAll();
        notify('error getting current playing music');
      })
    }



  }
}]);
