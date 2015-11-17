exports.loadWebApi = function (server) {

    server.get('/fu/:userid/:path', function (req, res) {
        res.send('Ok');
    });

};
