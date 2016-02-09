var ROOT_PATH   = '../../../../';
var db          = require(ROOT_PATH+'db')();
var global_func = require('../../global_functions');

/**
 * @param {Object} req
 * @param {Object} res
 * 
 * @returns {undefined}
 * 
 * @description Delets the user and his files.
 */
exports.deleteUser = function (req, res) {
    var response = 200;
    var params = req.params;
    var username = params.username;

    if (username === undefined) {
        var cookies = req.cookies;
        var isAdmin = global_func.isAdminUser(cookies);

        if (isAdmin) {
            var adminsC = db.getAdminsLength();
            if (adminsC === 1) {
                response = 404;
            } else {
                var user = global_func.getCookieField(cookies, 0);
                var pass = global_func.getCookieField(cookies, 1);

                db.del_user(user, pass);
            }
        }
    } else {
        var user_pass = db.getUserField(username, 'p');
        db.del_user(username, user_pass);
    }

    res.sendStatus(response);
};


