 //execute commands
var util = require('util');
var exec = require('child_process').exec;
var sleep = require('sleep');
var fs = require('fs');
var homeDefinitionService = require('./homeDefinition');


var alarms=[];

fs.readFile('./config/alarms.json','utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  alarms = JSON.parse(data);
  //console.log('alarms loaded');
});

exports.alarms = function (req, res) {
  var alarmForRoom = [];
  for(var i=0;i<alarms.length;i++){
    if(alarms[i].host === req.query.host){
        alarmForRoom.push(alarms[i]);
    }
  }
  res.json(alarmForRoom);
};

exports.alarm = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < alarms.length) {
    res.json(alarms[id]);
  } else {
    res.json(404);
  }
};

//POST
exports.addAlarm = function (req, res) {
    alarms.push(req.body);
};

// PUT
exports.editAlarm = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id <= alarms.length) {
    alarms[id] = req.body;
    res.send(200);
  } else {
    res.json(404);
  }
};

//PUT
exports.editAllAlarms = function (req, res) {
    var newAlarmList=[];
    for(var i=0;i<alarms.length;i++){
      if(alarms[i].host != req.query.host){
          newAlarmList.push(alarms[i]);
      }
    }
    for(var i=0;i<req.body.length;i++){
      newAlarmList.push(req.body[i]);
    }
    alarms= newAlarmList;
    getPathToAlarmScript(function(pathToAlarmScript){
        var execString="echo \"";
        for(var i=0;i<alarms.length;i++){
            var alarm = alarms[i];
            if(alarm.on){
                var alarmPlug =  getAlarmPlug(alarm);
                var alarmStartCrontab = getCrontabAlarmStart(alarm);
                var alarmStopCrontab = getCrontabAlarmStop(alarm);
                var playlist = "/storage/music";
                if(alarm.playlist){
                    playlist=alarm.playlist;
                }
                execString += alarmStartCrontab+pathToAlarmScript+"turnMusicOn.sh "+getPlugCode(alarmPlug)+ " "+alarm.host+ " "+playlist+" \n ";
                execString += alarmStopCrontab+pathToAlarmScript+"turnMusicOff.sh "+getPlugCode(alarmPlug)+ " "+alarm.host+" \n";
            }
        }
        execString+="\" >> mycron; crontab mycron; rm mycron";
        //console.log(execString);
        exec(execString,function(){
            fs.writeFile("./config/alarms.json", JSON.stringify(alarms), function(err) {
                if(err) {
                    return console.log(err);
                }
            });
            res.send(200);
        });
    });
};

// DELETE
exports.deleteAlarm = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < alarms.length) {
    //console.log('Delete alarm with id: ' + id);
    alarms.splice(id, 1);
    res.send(200);
  } else {
    res.json(404);
  }
};

function writeAllAlarmsInCrontab(){
    for (var i=0;i<alarms.length;i++){
        addAlarmStartToCrontab(alarms[i]);
    }
}

function addAlarmToCrontab(alarm,callback){
  getPathToAlarmScript(function(pathToAlarmScript){
    var alarmPlug =  getAlarmPlug(alarm);
    var alarmStartCrontab = getCrontabAlarmStart(alarm);
    var alarmStopCrontab = getCrontabAlarmStop(alarm);
    var playlist = "/storage/music";
    if(alarm.playlist){
        playlist=alarm.playlist;
    }
    var execString = "echo \""+alarmStartCrontab+pathToAlarmScript+"turnMusicOn.sh "+getPlugCode(alarmPlug)+ " "+alarm.host+ " "+playlist+" \n ";
    execString += alarmStopCrontab+pathToAlarmScript+"turnMusicOff.sh "+getPlugCode(alarmPlug)+ " "+alarm.host+" \" >> mycron; crontab mycron; rm mycron";
    exec(execString,callback);
  });
}

function getPlugCode(plug){
    return plug.FMCode + " " + plug.plugNumber ;
}

function getAlarmPlug(alarm){
    var homeDefinition = homeDefinitionService.returnHomeDefinition();
    for (var i=0;i<homeDefinition.rooms.length;i++){
        if(homeDefinition.rooms[i].music){
            if(homeDefinition.rooms[i].music.host === alarm.host){
                return homeDefinition.rooms[i].music.plug;
            }
        }
    }
}

function getCrontabAlarmStart(alarm){
    return alarm.min + " " + alarm.hour + " * * "+ getTimingFrequencyForCrontab(alarm.frequency)+" ";
}

function getCrontabAlarmStop(alarm){
    var crontabAlarm ="";
    var lastTime = 10;
    if(alarm.lastTime){
        lastTime = alarm.lastTime;
    }
    var totalMinute = parseInt(alarm.min) + lastTime;
    var hoursToAdd = Math.floor(totalMinute/60);
    var alarmStopMinute = totalMinute%60;
    var alarmStopHour = (parseInt(alarm.hour) + hoursToAdd) % 24;
    if(parseInt(alarm.hour) + hoursToAdd>=24){
        var additionalDays = Math.floor((parseInt(alarm.hour) + hoursToAdd)/24);
        return alarmStopMinute + " " + alarmStopHour + " * * "+ getTimingFrequencyForCrontab(getFrequencyNextDay(alarm.frequency,additionalDays))+" ";
    }
    return alarmStopMinute + " " + alarmStopHour + " * * "+ getTimingFrequencyForCrontab(alarm.frequency)+" ";
}

function getFrequencyNextDay(frequency,additionalDays){
    var newFrequency = []
    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    for(var i =0;i<days.length;i++){
        if(frequency[days[i]]){
           newFrequency[days[(i+additionalDays)%7]]=true;
        }
    }
    return newFrequency;
}

function getTimingFrequencyForCrontab(frequency){
    var crontabFrequency="";
    var firstFound = true;
    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    for(var i =0;i<days.length;i++){
        if(frequency[days[i]]){
            if(!firstFound){
                crontabFrequency += ",";
            }
            firstFound=false;
            crontabFrequency+=i;
        }
    }
    if(crontabFrequency===""){
        return "*";
    }
    return crontabFrequency;

}

function getPathToAlarmScript(callback){
    exec("pwd",function(error, stdout, stderr){
       var pathToScript = stdout.replace("\n", "");
       pathToScript += "/scripts/";
       callback(pathToScript);
    });
}

function removeAllAlarmsfromCrontab(){

}
