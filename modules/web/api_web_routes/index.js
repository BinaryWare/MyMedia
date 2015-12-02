exports.loadWebApi = function (server) {
    var db = require('../../db')();
    var cipher = require('../../cipher');

    server.get('/mmapi/fu/:userid/:path', function (req, res) {
        res.send('Ok');
    });

    server.post('/mmapi/user/login', function(req, res){
        var body = req.body;
        var username = body.username;
        var password = body.password;
        var isUserLoggedIn = db.do_login(username, password);
        
        if(isUserLoggedIn){
            res.cookie('mmu', cipher.encode(username+';'+password), { httpOnly: true });
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
