/**
 * @module App_Sys
 */

var app = require('app');
var BrowserWindow = require('browser-window');
var bWinObj = null;
var BROWSER_SETTINGS = {
    'width': 800,
    'height': 600,
    'show': true,
    'center': true,
    'auto-hide-menu-bar': true,
    'resizable': true,
    'icon':'mm_icon.png',
    'node-integration': false
};

exports.loadAppSys = function(){
    app.on('ready', function(){
        bWinObj = new BrowserWindow(BROWSER_SETTINGS);

        bWinObj.loadUrl('http://localhost:9900/');
        bWinObj.show();
    });

    app.on('window-all-closed', function() {
        app.quit();
    });
};
