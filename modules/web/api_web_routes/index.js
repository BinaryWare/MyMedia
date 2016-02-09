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
exports.loadWebApi = function (server) {
    var login = require('./routes/login');
    var logout = require('./routes/logout');
    var del_user = require('./routes/delete_user');
    var change_user_pass = require('./routes/change_user_pass');
    var add_user = require('./routes/add_user');
    var edit_user = require('./routes/edit_user');
    var list_users = require('./routes/list_user');
    var statistics = require('./routes/statistics_get');
    var user_files = require('./routes/user_files');
    
    server.post('/mmapi/fu/add/file', user_files.addUserFile);
    
    server.get('/mmapi/fu/get/preview', user_files.getUserFileForPreview);
    server.post('/mmapi/fu/get/file', user_files.getUserFile);
    server.post('/mmapi/fu/get/dir', user_files.getUserFolder);
    server.post('/mmapi/user/login', login.doLogin);
    
    server.get('/mmapi/user/logout', logout.doLogout);
    server.post('/mmapi/user/delete/:username', del_user.deleteUser);
    server.post('/mmapi/user/cpwd', change_user_pass.changeUserPass);
    server.post('/mmapi/user/add', add_user.addNewUser);
    
    server.post('/mmapi/user/edit', edit_user.editUser);
    server.get('/mmapi/users/list', list_users.listUsers);
    server.get('/mmapi/stats/get', statistics.getAllStats);
};
