var ROOT_PATH   = '../../../../';
var fusers      = require(ROOT_PATH+'fusers')();
var global_func = require('../../global_functions');
var cipher      = require(ROOT_PATH+'cipher');

exports.getUserFolder = function(req, res){
    var cookies = req.cookies;
    var body = req.body;
    var path = body.path;
    var userid = global_func.getCookieField(cookies, 0);
    var user_dir = fusers.readUserDir(cipher.encode(userid), path);
    
    res.send(JSON.stringify({
        u_dir:user_dir
    }));
};

exports.getUserFile = function(req, res){
    var cookies = req.cookies;
    var body = req.body;
    var path = body.path;
    var file = body.file;
    var userid = global_func.getCookieField(cookies, 0);
    var user_file = fusers.readUserFile(cipher.encode(userid), path, file);
    
    res.send(new Buffer(user_file.toString()).toString('base64'));
};

exports.getUserFileForPreview = function(req, res){
    var cookies = req.cookies;
    var query = req.query;
    var filename = query.f;
    var path = query.p;
    var userid = global_func.getCookieField(cookies, 0);
    
    userid = cipher.encode(userid);
    
    var options = {
        root: 'fu/'+userid+path,
        dotfiles: 'deny'
    };
    
    res.sendFile(filename, options, function (err) {
        if (err) 
            res.send('File Not Found!');
    });
};
