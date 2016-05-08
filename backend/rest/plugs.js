 //execute commands
var util = require('util');
var exec = require('child_process').exec;
var sleep = require('sleep');
var script = "sudo /home/pi/rcswitch-pi/send"

// PUT
exports.changeStatus = function (req, res) {
  exports.changePlugStatus(req.body.plug,req.body.status);
  res.send(200);
};

exports.changePlugStatus= function(plug,status){
  var command = getPlugCode(plug);
  switchStatus(script,command,status);
}

function switchStatus(script, command, status){
    var execString = script + " " + command + " " + status;
    //console.log("Executing: " + execString);
    exec(execString, puts);
    sleep.sleep(1)//sleep for 1 seconds
}

function puts(error, stdout, stderr) {
        //util.puts(stdout);
        //console.warn("Executing Done");
}

function getPlugCode(plug){
    return plug.FMCode + " " + plug.plugNumber ;
}