/**
 * @module Web
 */

var fs = require('fs');

module.exports = function (renderECT) {
    var r_api = {};
    var rEct = renderECT;
    
    function checkFile(route_name) {
        var res = true;
        try {
            fs.readFileSync('www/pages/' + route_name + '.ect');
        } catch (ex) {
            res = false;
        }
        return res;
    }
    
    r_api.render = function (res, route_name, data) {
        if (data === null || data === undefined)
            data = {};

        var html = '';
        if(!checkFile(route_name))
            route_name = 'page_not_found';
        
        html = rEct.render(route_name + '.ect', data);    
        
        res.send(html);
    };
    
    return r_api;
};