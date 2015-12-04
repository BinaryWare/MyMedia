/**
 * @module Db/User_Permissions
 */

var cipher     = require('../../cipher');
var user_perms = require('./user_permssions.js');

/**
 * 
 * @param {Object}           userobj
 * @param {User_permissions} user_perm
 * 
 * @returns {boolean}
 */
exports.checkUserPerm = function(userobj, user_perm){
    var up_c = cipher.decode(userobj.up);
    return (up_c.indexOf(user_perm)!==-1);
};

/**
 * @param {String} arr_perm
 * 
 * @returns {Object}
 * 
 * @description Gets the permissions and parses into boolean flags.
 */
exports.getPermissionsForWeb = function(arr_perm){
    arr_perm = arr_perm.split(',');
    
    var perms = {
        isAdmin: (arr_perm.indexOf(user_perms.ADMIN)!==-1),
        isUser: (arr_perm.indexOf(user_perms.USER)!==-1),
        isViewer: (arr_perm.indexOf(user_perms.VIEWER)!==-1)
    };
    
    return perms;
};