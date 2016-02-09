var ROOT_PATH   = '../../../../';
var db          = require(ROOT_PATH+'db')();
var global_func = require('../../global_functions');

/**
 * @param {Object} req
 * @param {Object} res
 * 
 * @returns {undefined}
 * 
 * @description Changes the user password.
 */
exports.changeUserPass = function (req, res) {
    var response = 200;
    var body = req.body;
    var o_pwd = body.o_pwd;
    var n_pwd = body.n_pwd;
    var user = global_func.getCookieField(req.cookies, 0);
    var isUserPasswordValid = db.do_login(user, o_pwd);

    if (isUserPasswordValid) {
        if (n_pwd === '' || n_pwd === undefined || n_pwd === ' ' || n_pwd.split('').length < 5) {
            response = 500;
        } else {
            var isUserEdited = db.edit_user(user, o_pwd, n_pwd);

            if (!isUserEdited)
                response = 201;
        }
    } else {
        response = 404;
    }

    res.sendStatus(response);
};


