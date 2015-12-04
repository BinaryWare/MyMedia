/**
 * @module Cipher
 */

var crypto    = require('crypto');
var algorithm = 'aes-256-cbc';
var key       = 'My#m3D1@ !2015#!c';

/**
 *
 * @param {String} data
 *
 * @returns {String}
 *
 * @description Encodes all the data into cipher encryption
 */
exports.encode = function (data) {
    var res='';
    if(data!=='') {
        var cipher = crypto.createCipher(algorithm, key);
        var crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        res=crypted;
    }

    return res;
};

/**
 *
 * @param {String} data
 *
 * @returns {String}
 *
 * @description Decodes all the cipher encryption into data.
 */
exports.decode = function (data) {
    var res='';
    if(data!==''){
        var decipher = crypto.createDecipher(algorithm, key);
        var dec = decipher.update(data, 'hex', 'utf8');
        dec += decipher.final('utf8');
        res=dec;
    }

    return res;
};
