/**
 * Module dependencies.
 */
var express = require('express'),
    alarms = require('./rest/alarms'),
    homeDefinition = require('./rest/homeDefinition'),
    music = require('./rest/music'),
    plugs = require('./rest/plugs');;
var app = express();

// Configuration

// ## CORS middleware
// 
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function(){
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(express.bodyParser());
});

// JSON API
app.get('/homedef', homeDefinition.getHomeDefinition);
app.put('/plug/status',plugs.changeStatus)
app.post('/music/sleep', music.setSleepMusic);
app.post('/music', music.musicControl);
app.get('/music/playlists',music.getGlobalPlaylists);
app.get('/alarms', alarms.alarms);
app.get('/alarms/:id', alarms.alarm);
app.put('/alarms/:id', alarms.editAlarm);
app.put('/alarms', alarms.editAllAlarms);
app.post('/alarms', alarms.addAlarm);
app.delete('/alarms/:id', alarms.deleteAlarm);
// Start server
app.listen(9000);
console.log("Server running at http://127.0.0.1:8000/");
