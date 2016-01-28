var ROOT_PATH   = '../../../../';
var user_perm   = require(ROOT_PATH+'db/user_permissions/user_permssions.js');
var db          = require(ROOT_PATH+'db')();
var global_func = require('../../global_functions');

exports.addNewUser = function (req, res) {
    var response = 200;
    var body     = req.body;
    var cookies  = req.cookies;
    var isAdmin  = global_func.isAdminUser(cookies);

    if (isAdmin) {
        var user  = body.u;
        var pass  = body.p;
        var uperm = body.up;

        var is_admin  = (uperm.indexOf(user_perm.ADMIN) !== -1);
        var is_user   = (uperm.indexOf(user_perm.USER) !== -1);
        var is_viewer = (uperm.indexOf(user_perm.VIEWER) !== -1);

        if (!db.add_user(user, pass, is_admin, is_user, is_viewer))
            response = 500;
    } else {
        response = 403;
    }

    res.sendStatus(response);
};

