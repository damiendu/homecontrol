 //execute commands
var util = require('util');
var exec = require('child_process').exec;
var fs = require('fs');

var homeDefinition={};

fs.readFile('./config/homeDefinition.json','utf8',function (err,data) {
  if (err) {
    return console.log(err);
  }
  homeDefinition = JSON.parse(data);
 // console.log('home definition loaded');
});

exports.returnHomeDefinition = function(){
    return homeDefinition;
}

// GET
exports.getHomeDefinition = function(req,res){
    res.json(homeDefinition);
}