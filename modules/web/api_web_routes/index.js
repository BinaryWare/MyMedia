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
exports.loadWebApi = function (server, db, cipher, user_perm) {

    function isAdminUser(cookie) {
        var mmu_perm_arr = getCookieField(cookie, 2).split(',');

        return (mmu_perm_arr.indexOf(user_perm.ADMIN)!==-1);
    }
    
    function getCookieField(cookie, field_index){
        var mmu = cookie.mmu;
        var dec_mmu = cipher.decode(mmu);
        var dec_mmu_arr = dec_mmu.split(';');
        return dec_mmu_arr[field_index];
    }
    
    /**
     * Get user's file route. (In Construction)
     */
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
    
    server.post('/mmapi/user/delete/:username', function(req, res){
        var response = 200;
        var params = req.params;
        var username = params.username;
        
        if(username===undefined){
            var cookies = req.cookies;
            var isAdmin = isAdminUser(cookies);
            
            if(isAdmin){
                var adminsC = db.getAdminsLength();
                if(adminsC===1){
                    response = 404;
                }else{
                    var user = getCookieField(cookies, 0);
                    var pass = getCookieField(cookies, 1);
                    
                    db.del_user(user, pass);
                }
            }
        }else{
            var user_pass = db.getUserField(username, 'p');
            db.del_user(username, user_pass);
        }
        
        res.sendStatus(response);
    });
    
    server.post('/mmapi/user/cpwd', function(req, res){
        var response = 200;
        var body = req.body;
        var o_pwd = body.o_pwd;
        var n_pwd = body.n_pwd;
        var user = getCookieField(req.cookies, 0);
        var isUserPasswordValid = db.do_login(user, o_pwd);
        
        if(isUserPasswordValid){
            if(n_pwd==='' || n_pwd===undefined || n_pwd===' ' || n_pwd.split('').length<5){
               response = 500; 
            }else{
               var isUserEdited = db.edit_user(user, o_pwd, n_pwd);
               
               if(!isUserEdited)
                   response = 201;
            }
        }else{
            response = 404;
        }
        
        res.sendStatus(response);
    });
};
