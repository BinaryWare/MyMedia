exports.loadWebApi = function (server) {
    var db = require('../../db');

    server.get('/mmapi/fu/:userid/:path', function (req, res) {
        res.send('Ok');
    });

    server.post('/mmapi/user/login', function(req, res){
        var body = req.body;
        var username = body.username;
        var password = body.password;
        var isUserLoggedIn = db.do_login(username, password);
        
        if(isUserLoggedIn){
            res.cookie('mmu', username+';'+password);
        }
    });
    
    server.get('/mmapi/user/logout', function(req, res){
        res.clearCookie('mmu', {});
        res.redirect('/');
    });
};
