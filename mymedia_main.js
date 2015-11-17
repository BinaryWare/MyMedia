var SERVER_PORT = 8000;
var express = require('express');
var server = express();
var console = require('./modules/console');
var app_sys = require('./modules/app_sys');
var webS = require('./modules/web');

// Loads all GUI components
app_sys.loadAppSys();

// Loads all webserver resources
webS.loadWebServer(express, server);

// Server Listener
server.listen(SERVER_PORT, function(){
    console.info('Server Listening From Port '+SERVER_PORT);
});
