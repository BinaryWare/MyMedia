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
    
    server.post('/mmapi/user/add', function(req, res){
        var response = 200;
        var body = req.body;
        var cookies = req.cookies;
        var isAdmin = isAdminUser(cookies);
        
        if(isAdmin){
            var user = body.u;
            var pass = body.p;
            var uperm = body.up;
            
            var is_admin  = (uperm.indexOf(user_perm.ADMIN)!==-1);
            var is_user   = (uperm.indexOf(user_perm.USER)!==-1);
            var is_viewer = (uperm.indexOf(user_perm.VIEWER)!==-1);
                    
            if(!db.add_user(user, pass, is_admin, is_user, is_viewer))
                response = 500;
        }else{
            response = 403;
        }
        
        res.sendStatus(response);
    });
    
    server.post('/mmapi/user/edit', function(req, res){
        var response = 200;
        var body = req.body;
        var cookies = req.cookies;
        var isAdmin = isAdminUser(cookies);
        
        if(isAdmin){
            var user = body.u;
            var pass = body.p;
            var uperm = body.up;
            
            if(!db.edit_user_with_admin(user, pass, uperm))
                response = 500;
        }else{
            response = 403;
        }
        
        res.sendStatus(response);
    });
    
    server.get('/mmapi/users/list', function (req, res) {
        var cookies = req.cookies;
        var isAdmin = isAdminUser(cookies);
        
        if(isAdmin){
            var c_user = getCookieField(cookies, 0); 
            var user_list = db.getUsersList();
            
            if((user_list.length-1) !== 0){
                user_list = user_list.filter(function(u){
                    var user = u;
                
                    user.u = cipher.decode(u.u);
                    if(user.u !== c_user){
                        user.p = '*******************';
                        user.up = cipher.decode(u.up);
                    
                        return user;
                    }
                });
            } else {
                user_list = [];
            }
            
            user_list = JSON.stringify({ users: user_list });
            
            db.refreshDBData();
            res.send(user_list);
        }else{
            res.sendStatus(403);
        }
    });
    
    server.get('/mmapi/stats/get', function (req, res) {
        var cookies = req.cookies;
        var isAdmin = isAdminUser(cookies);
        
        if(isAdmin){
            var user_list = db.getUsersList();
            var res_stats = {
                u_number:0,
                a_number:0,
                us_number:0
            };
            
            if(user_list.length !== 0){
                var u_number = 0;
                var a_number = 0;
                var us_number = 0;
                
                user_list.filter(function(u){
                    var user = u;
                    var up = user.up = cipher.decode(u.up);
                    
                    var is_admin  = (up.indexOf(user_perm.ADMIN)!==-1);
                    var is_user   = (up.indexOf(user_perm.USER)!==-1);
                    var is_viewer = (up.indexOf(user_perm.VIEWER)!==-1);
                    
                    if(is_admin)
                        a_number++;
                    
                    if(is_user)
                        u_number++;
                    
                    if(is_viewer)
                        us_number++;
                    
                    return user;
                });
                
                res_stats.a_number = a_number;
                res_stats.u_number = u_number;
                res_stats.us_number = us_number;
            } 
            
            db.refreshDBData();
            res.send(JSON.stringify(res_stats));
        }else{
            res.sendStatus(403);
        }
    });
};
