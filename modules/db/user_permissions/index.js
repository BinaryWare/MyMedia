var cipher    = require('../../cipher');

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