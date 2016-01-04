/**
 * @module Web
 */

var KEY_COOKIE       = 'my#M3d1@!#!2015!';
var ECT              = require('ect');
var body_parser      = require('body-parser');
var cookie_parser    = require('cookie-parser');
var sec_routes       = ['/main', '/settings', '/mmapi/user/logout', '/mmapi/user/cpwd'];
var HEADERS_SETTINGS = {
                        'X-Frame-Options': 'deny',
                        'X-XSS-Protection': '1; mode=block',
                        'X-Content-Type-Options': 'nosniff'
                       };
var renderECT        = ECT({
                        root: __dirname + '/../../www/pages',
                        ext: '.ect'
                       });
var loadEctFile      = require('./loadFiles.js')(renderECT);
var web_api          = require('./api_web_routes');
var cipher           = require('../cipher');
var db               = require('../db')();
var user_perm        = require('../db/user_permissions/user_permssions.js');

exports.loadWebServer = function (express, server) {
    //Third-party functions
    
    function setAllHeaders(res) {
        res.set(HEADERS_SETTINGS);
        res.removeHeader('X-Powered-By');
    }
    
    function hasCookie(cookies){
        return (cookies.mmu!==undefined);
    }
    
    // Set all server configurations
    
    server.use(body_parser.urlencoded({extended: false}));
    server.use(body_parser.json({ limit: '200mb' }));
    server.engine('ect', renderECT.render);
    server.use(cookie_parser(KEY_COOKIE, { path:'/', httpOnly:true }));
    server.use('/libs', express.static('www/libs', {
        setHeaders:function(res, path, stat){
            setAllHeaders(res);
        }
    }));
    
        
    // Server Filter
    server.use(function(req, res, next){
        var mmu=req.cookies.mmu;

        setAllHeaders(res);
        
       ((mmu===undefined) && (sec_routes.indexOf(req.url)!==-1))? res.redirect('/') : next();
    });
    
    
    //==========================================================================
    //======================== Server Routes ===================================
    //==========================================================================
    
    // Server API
    
    web_api.loadWebApi(server, db, cipher, user_perm);
    
    /**
     * Route Web Method: GET
     *
     * Description: Shows the web page file (Depends on the page parameter)
     **/
    server.get('/', function (req, res) {
        var route = 'login';
        
        if(hasCookie(req.cookies))
            route = 'main';
        
        res.redirect('/'+route);
    });

    /**
     * Route Web Method: GET
     *
     * @param {String} page
     *
     * Description: Shows the web page file (Depends on the page parameter)
     **/
    server.get('/:page', function (req, res) {
        var pt = req.query.pt;
        var page = req.params.page;
        var cookies = req.cookies;
        var mmu = cookies.mmu;
        var data = {};
        
        if(hasCookie(cookies)){
            var dec_mmu = cipher.decode(mmu);
            var dec_mmu_arr = dec_mmu.split(';');
            var dec_mmu_user = dec_mmu_arr[0];
            var dec_mmu_perm = dec_mmu_arr[2];
            
            data.isUserLogged = true;
            data.username = dec_mmu_user;
            data.user_pm = db.getPermissionsForWeb(dec_mmu_perm);
        }
        
        if(pt!==undefined){
            
        }
        
        loadEctFile.render(res, page, data);
    });
};

