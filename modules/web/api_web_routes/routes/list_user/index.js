var ROOT_PATH   = '../../../../';
var db          = require(ROOT_PATH+'db')();
var cipher      = require(ROOT_PATH+'cipher');
var global_func = require('../../global_functions');

exports.listUsers = function (req, res) {
    var cookies = req.cookies;
    var isAdmin = global_func.isAdminUser(cookies);

    if (isAdmin) {
        var c_user = global_func.getCookieField(cookies, 0);
        var user_list = db.getUsersList();

        if ((user_list.length - 1) !== 0) {
            user_list = user_list.filter(function (u) {
                var user = u;

                user.u = cipher.decode(u.u);
                if (user.u !== c_user) {
                    user.p = '*******************';
                    user.up = cipher.decode(u.up);

                    return user;
                }
            });
        } else {
            user_list = [];
        }

        user_list = JSON.stringify({users: user_list});

        db.refreshDBData();
        res.send(user_list);
    } else {
        res.sendStatus(403);
    }
};

