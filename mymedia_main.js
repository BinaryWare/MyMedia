var SERVER_PORT = 9900;
var express = require('express');
var server = express();
var console = require('./modules/console');
var webS = require('./modules/web');
var sys_params = require('./modules/sys_parameters');

// System parameters detection
sys_params.detectParams(process);

// Loads all webserver resources
webS.loadWebServer(express, server, SERVER_PORT);

// Server Listener
server.listen(SERVER_PORT, function(){
    console.info('Server Listening From Port '+SERVER_PORT);
});
