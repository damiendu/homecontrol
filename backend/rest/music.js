 //execute commands
var util = require('util');
var exec = require('child_process').exec;
var sleep = require('sleep');
var plugController = require('./plugs');
var homeDefinitionService = require('./homeDefinition');

var sleepTimeOut;

var playlists = [];
var playlistLoaded = false;

//POST
exports.musicControl = function (req,res){
    var room = req.body.room;
    var url = "http://"+room+"/jsonrpc";
    var jsonToSend = req.body.jsonToSend;
    var execString = "curl -i -X POST -H 'Content-Type: application/json' -d '" +JSON.stringify(jsonToSend)+ "' " + url;
    // console.log("Executing: " + execString);
    exec(execString, function(error, stdout, stderr){
        puts(error, stdout, stderr);
        var outputSplited = stdout.split('\r\n\r\n');
        if(outputSplited.length>1){
            res.json(outputSplited[1]);
        }else{
            res.json('{}');
        }
    });
}

//GET
exports.getGlobalPlaylists = function(req,res){
    if(!playlistLoaded){
        loadPlaylists();
    }
    res.json({result:{files:playlists}});
}

//PUT
exports.setSleepMusic = function(req,res){

    if(sleepTimeOut){
	clearTimeout(sleepTimeOut);
    }
    sleepTimeOut = setTimeout(
        function(){
		    var plug = req.body.plug;
        	var host = req.body.host;
        	plugController.changePlugStatus(plug,0);
            var url = "http://"+host+"/jsonrpc";
            var jsonToSend='{jsonrpc: "2.0", method: "Player.Stop", id: 1, params: {playerid: 0}';
            var execString = "curl -i -X POST -H 'Content-Type: application/json' -d '" +jsonToSend+ "' " + url;
           // console.log("Executing: " + execString);
            exec(execString, puts);
        }
        ,req.body.sleepMinutes*60000);
        res.send(200);
}

function puts(error, stdout, stderr) {
        //util.puts(stdout);
        //console.warn("Executing Done");
}

function loadPlaylists(){
    var homeDefinition = homeDefinitionService.returnHomeDefinition();
    for (var j=0;j<homeDefinition.musicSources.length;j++){
        var musicSource = homeDefinition.musicSources[j];
        var execString = "ls -d "+musicSource.pathFromServer+"/**/*;";
        //console.log("Executing: " + execString);
        exec(execString, function(error, stdout, stderr){
            puts(error, stdout, stderr);
            var outputSplited = stdout.split('\n');
            for (var i=0;i<outputSplited.length;i++){
                var playlist={};
                playlist.label=musicSource.label+" : "+outputSplited[i];
                playlist.file=musicSource.pathFromMusicPlayer+"/"+outputSplited[i];
                playlists.push(playlist);
            }
        });
    }
    playlistLoaded = true;
    //console.log("Playlists loaded");
}