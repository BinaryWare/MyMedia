module.exports = function (renderECT) {
    var r_api = {};
    var rEct = renderECT;
    
    r_api.render = function (res, route_name, data) {
        if (data === null || data === undefined)
            data = {};

        var html = rEct.render(route_name + '.ect', data);
        res.send(html);
    };
    
    return r_api;
};