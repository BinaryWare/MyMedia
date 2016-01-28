var ROOT_PATH   = '../../../../';
var db          = require(ROOT_PATH+'db')();
var global_func = require('../../global_functions');

exports.editUser = function (req, res) {
    var response = 200;
    var body = req.body;
    var cookies = req.cookies;
    var isAdmin = global_func.isAdminUser(cookies);

    if (isAdmin) {
        var user = body.u;
        var pass = body.p;
        var uperm = body.up;

        if (!db.edit_user_with_admin(user, pass, uperm))
            response = 500;
    } else {
        response = 403;
    }

    res.sendStatus(response);
};

