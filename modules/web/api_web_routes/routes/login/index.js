var ROOT_PATH  = '../../../../';
var cipher     = require(ROOT_PATH+'cipher');
var db         = require(ROOT_PATH+'db')();

/**
 * @param {Object} req
 * @param {Object} res
 * 
 * @returns {undefined}
 * 
 * @description Login user session function.
 */
exports.doLogin = function (req, res) {
    var body = req.body;
    var username = body.username;
    var password = body.password;
    var isUserLoggedIn = db.do_login(username, password);

    if (isUserLoggedIn) {
        var userPerms = db.get_user_perms(username);
        res.cookie('mmu', cipher.encode(username + ';' + password + ';' + userPerms), {httpOnly: true});
        res.send('/main');
    } else {
        res.sendStatus(404);
    }
};

