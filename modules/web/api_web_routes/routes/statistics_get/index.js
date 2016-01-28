var ROOT_PATH   = '../../../../';
var user_perm   = require(ROOT_PATH+'db/user_permissions/user_permssions.js');
var db          = require(ROOT_PATH+'db')();
var cipher      = require(ROOT_PATH+'cipher');
var global_func = require('../../global_functions');

exports.getAllStats = function (req, res) {
    var cookies = req.cookies;
    var isAdmin = global_func.isAdminUser(cookies);

    if (isAdmin) {
        var user_list = db.getUsersList();
        var res_stats = {
            u_number: 0,
            a_number: 0,
            us_number: 0
        };

        if (user_list.length !== 0) {
            var u_number = 0;
            var a_number = 0;
            var us_number = 0;

            user_list.filter(function (u) {
                var user = u;
                var up = user.up = cipher.decode(u.up);

                var is_admin = (up.indexOf(user_perm.ADMIN) !== -1);
                var is_user = (up.indexOf(user_perm.USER) !== -1);
                var is_viewer = (up.indexOf(user_perm.VIEWER) !== -1);

                if (is_admin)
                    a_number++;

                if (is_user)
                    u_number++;

                if (is_viewer)
                    us_number++;

                return user;
            });

            res_stats.a_number = a_number;
            res_stats.u_number = u_number;
            res_stats.us_number = us_number;
        }

        db.refreshDBData();
        res.send(JSON.stringify(res_stats));
    } else {
        res.sendStatus(403);
    }
};

