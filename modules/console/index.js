/**
 * @module Console
 */

var colors = require('colors');

/**
 * @param {String|Object} msg
 * 
 * @returns {undefined}
 * 
 * @description Outputs the message with color (GREY).
 */
exports.log = function(msg){
    console.log((msg).grey);
};

/**
 * @param {String|Object} msg
 * 
 * @returns {undefined}
 * 
 * @description Outputs the message with color (GREEN).
 */
exports.info = function(msg){
    console.log((msg).green);
};

/**
 * @param {String|Object} msg
 * 
 * @returns {undefined}
 * 
 * @description Outputs the message with color (RED).
 */
exports.error = function(msg){
    console.log((msg).red);
};

/**
 * @param {String|Object} msg
 * 
 * @returns {undefined}
 * 
 * @description Outputs the message with color (YELLOW).
 */
exports.warn = function(msg){
    console.log((msg).yellow);
};