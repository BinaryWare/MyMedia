/**
 * @module Web/Api_Web_Routes
 */

/**
 * 
 * @param {Object} server
 * @param {Db} db
 * @param {Cipher} cipher
 * 
 * @returns {undefined}
 * 
 * @description Loads all the rest api for webserver application.
 */
exports.loadWebApi = function (server, db, cipher) {
    server.get('/mmapi/fu/:userid/:path', function (req, res) {
        res.send('Ok');
    });

    server.post('/mmapi/user/login', function(req, res){
        var body = req.body;
        var username = body.username;
        var password = body.password;
        var isUserLoggedIn = db.do_login(username, password);
        
        if(isUserLoggedIn){
            var userPerms = db.get_user_perms(username);
            res.cookie('mmu', cipher.encode(username+';'+password+';'+userPerms), { httpOnly: true });
            res.send('/main');
        } else {
            res.sendStatus(404);
        }
    });
    
    server.get('/mmapi/user/logout', function(req, res){
        res.clearCookie('mmu', { httpOnly: true });
        res.redirect('/');
    });
};
