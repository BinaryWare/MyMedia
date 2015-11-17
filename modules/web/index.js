var KEY_COOKIE       = 'my#M3d1@!#!2015!';
var ECT              = require('ect');
var body_parser      = require('body-parser');
var cookie_parser    = require('cookie-parser');
var sec_routes       = ['/main'];
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

exports.loadWebServer = function (express, server) {
    //Third-party functions
    
    function setAllHeaders(res) {
        res.set(HEADERS_SETTINGS);
        res.removeHeader('X-Powered-By');
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
        var umb=req.cookies.umb;

        setAllHeaders(res);

       ((umb===undefined) && (sec_routes.indexOf(req.url)!==-1))? res.redirect('/') : next();
    });
    
    
    //==========================================================================
    //======================== Server Routes ===================================
    //==========================================================================
    
    // Server API
    
    web_api.loadWebApi(server);
    
    /**
     * Route Web Method: GET
     *
     * Description: Shows the web page file (Depends on the page parameter)
     **/
    server.get('/', function (req, res) {
        loadEctFile.render(res, 'login');
    });

    /**
     * Route Web Method: GET
     *
     * @param {String} page
     *
     * Description: Shows the web page file (Depends on the page parameter)
     **/
    server.get('/:page', function (req, res) {
        var page = req.params.page;
        
        if(page===undefined)
            page = 'login';
        
        loadEctFile.render(res, page);
    });
};
