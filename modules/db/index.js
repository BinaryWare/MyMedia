/** 
 * @module Db
 **/

var user_perm = require('./user_permissions/user_permssions.js');
var u_perm = require('./user_permissions');
var cipher = require('../cipher');
var mem = require('../mem');
var fuser = require('../fusers')();
var fs = require('fs');
var DB_FILE = 'local.dbj';
var DEFAULT_USER_PERM = [user_perm.ADMIN, user_perm.USER, user_perm.VIEWER];
var DEFAULT_USER = {
    u: cipher.encode('admin'),
    p: cipher.encode('myM3D1@dmin'),
    up: cipher.encode(DEFAULT_USER_PERM.toString())
};
var DEFAULT_DB_STRUCT = {
    dbu: [DEFAULT_USER]
};

/**
 * @description Checks if the DB file exists.
 * 
 * @returns {boolean|isDBFileExists.res}
 */
function isDBFileExists() {
    var res = true;
    try {
        fs.openSync(DB_FILE, "r");
    } catch (ex) {
        res = false;
    } finally {
        return res;
    }
}

/**
 * 
 * @param {Object} data
 * 
 * @returns {undefined}
 * 
 * @description Writes all the data into the DB file.
 */
function writeDBFile(data) {
    mem.setMemDB(data);
    fs.writeFileSync(DB_FILE, JSON.stringify(data));
}

/**
 * 
 * @returns {String}
 * 
 * @description Reads the file and return his result as a string.
 */
function readDBFile() {
    return fs.readFileSync(DB_FILE);
}

/**
 * @returns {Object}
 * 
 * @description Reads in memory database. If the variable is null and file not 
 *              exists then it will load the default structure, otherwise it 
 *              will read the DB file and return his result.
 */
function readDBData() {
    var db_res = mem.getMemDB();
    
    if (db_res === null) {
        try {
            db_res = JSON.parse(readDBFile());
        } catch (ex) {
            writeDBFile(DEFAULT_DB_STRUCT);
            db_res = DEFAULT_DB_STRUCT;
        }finally{
            mem.setMemDB(db_res);    
        }
    }
    
    return db_res;
}

/**
 * @returns {undefined}
 * @description Refresh DB system.
 */
function refreshDBData(){
    try{
        mem.setMemDB(JSON.parse(readDBFile()));    
    }catch(ex){
        mem.setMemDB(DEFAULT_DB_STRUCT);
    }
}

/**
 * @returns {undefined}
 * 
 * @deprecated Not Used.
 * 
 * @description Check if the DB file exists.
 */
function checkDBFile() {
    if (!isDBFileExists()) {
        writeFile(DB_FILE);
    }
}

/**
 * @param {String} username
 * 
 * @returns {boolean}
 * 
 * @description Check if the username exists on DB.
 */
function checkDBUserExists(username) {
    var username_c = cipher.encode(username);
    var db_data = readDBData();

    db_data = db_data.dbu.filter(function (item) {
        return (item.u === username_c);
    });

    return (db_data.length >= 1);
}

module.exports = function () {
    var db_api = {};

    /*
     * 
     * @param {String} username
     * @param {String} user_field
     * 
     * @returns {String}
     * 
     * @description Gets the user and return a custom field value.
     */
    db_api.getUserField = function(username, user_field){
        var field_value = '';
        var username_c = cipher.encode(username);
        if (!checkDBUserExists(username)) {
            var db_data = readDBData();
            
            var user = db_data.dbu.filter(function(item){
                return (item.u === username_c);
            });
            
            if(user.length>=1){
                var u = user[0];
                field_value = u[user_field];
                
                if(field_value!==undefined){
                    field_value = cipher.decode(field_value);   
                }
            }
        }
        
        return field_value;
    };

    /**
     * @param {String} username
     * @param {String} password
     * 
     * @returns {boolean}
     * 
     * @description Login function.
     */
    db_api.do_login = function (username, password) {
        var password_c = cipher.encode(password);
        var username_c = cipher.encode(username);
        var db_data = readDBData();
        
        db_data = db_data.dbu.filter(function (item) {
            return ((item.u === username_c) && (item.p === password_c));
        });

        return (db_data.length >= 1);
    };

    /**
     * @param {String} username
     * 
     * @returns {boolean}
     * 
     * @description Checks the user on DB.
     */
    db_api.check_user_exists = function (username) {
        return checkDBUserExists(username);
    };

    /**
     * @param {String} username
     * @param {String} password
     * @param {boolean} isAdmin 
     * @param {boolean} isUser 
     * @param {boolean} isViewer 
     * 
     * @returns {boolean}
     * 
     * @description Add user on DB if the user not exists on DB.
     */
    db_api.add_user = function (username, password, isAdmin, isUser, isViewer) {
        var isUserReg = false;

        if (!checkDBUserExists(username)) {
            var db_data = readDBData();
            var user_c = cipher.encode(username);
            var pass_c = cipher.encode(password);
            var perm = [];
            
            if(isAdmin)
                perm.push(user_perm.ADMIN);
            
            if(isUser)
                perm.push(user_perm.USER);
            
            if(isViewer)
                perm.push(user_perm.VIEWER);

            var perm_c = cipher.encode(perm.toString());
            db_data.dbu.push({
                u: user_c,
                p: pass_c,
                up: perm_c
            });
            writeDBFile(db_data);

            fuser.createUserDir(user_c);

            isUserReg = true;
        }

        return isUserReg;
    };

    /**
     * 
     * @param {String} username
     * @param {String} password
     * 
     * @returns {boolean}
     * 
     * @description Deletes the username. The user is deleted if the password 
     *              and username are correct.
     */
    db_api.del_user = function (username, password) {
        var isUserDeleted = false;

        if (checkDBUserExists(username)) {
            var username_c = cipher.encode(username);
            var password_c = cipher.encode(password);
            var db_data = readDBData();

            db_data = db_data.dbu.filter(function (item) {
                var isUserValid = ((item.u !== username_c) && (item.p !== password_c));

                if (isUserValid) 
                    isUserDeleted = true;

                return isUserValid;
            });

            if (isUserDeleted) {
                writeDBFile({dbu: db_data});
                fuser.deleteUserDir(username_c);
            }
        }

        return isUserDeleted;
    };

    /**
     * 
     * @param {String} username
     * @param {String} password
     * @param {String} old_password
     * 
     * @returns {boolean}
     * 
     * @description Changes the password if the user exists and the old password are
     *              correct!
     */
    db_api.edit_user = function (username, password, old_password) {
        var isUserReg = false;
        
        if (checkDBUserExists(username)) {
            var old_password_c = cipher.encode(old_password);
            var password_c = cipher.encode(password);
            var username_c = cipher.encode(username);

            var db_data = readDBData();
            var c = 0;
            var fc = -1;

            db_data.dbu.filter(function (item) {
                var isValidUser = ((item.u === username_c) && (item.p === old_password_c));
                if (isValidUser) {
                    fc = c;
                }
                c++;

                return isValidUser;
            });

            if (fc !== -1) {
                db_data.dbu[fc].p = password_c;
                writeDBFile(db_data);

                isUserReg = true;
            }
        }

        return isUserReg;
    };
    
    /**
     * 
     * @param {String} username
     * @param {String} password
     * @param {String} permissions
     * 
     * @returns {boolean}
     * 
     * @description Changes any user info if the user exists!
     */
    db_api.edit_user_with_admin = function (username, password, permissions) {
        var isUserReg = false;

        if (checkDBUserExists(username)) {
            var permission_c = cipher.encode(permissions);
            var password_c = cipher.encode(password);
            var username_c = cipher.encode(username);

            var db_data = readDBData();
            var c = 0;
            var fc = -1;

            db_data.dbu.filter(function (item) {
                var isValidUser = ((item.u === username_c));
                if (isValidUser) {
                    fc = c;
                }
                c++;

                return isValidUser;
            });

            if (fc !== -1) {
                var default_hidden_pass = cipher.encode('*******************');
                if(password_c !== default_hidden_pass)
                    db_data.dbu[fc].p = password_c;    
                
                db_data.dbu[fc].up = permission_c;
                writeDBFile(db_data);

                isUserReg = true;
            }
        }

        return isUserReg;
    };

    /**
     * 
     * @param {String} username
     * @param {User_permissions} perm
     * 
     * @returns {boolean}
     * 
     * @description Checks the user permssions.
     */
    db_api.check_user_perm = function (username, perm) {
        var has_perm = false;

        if (checkDBUserExists(username)) {
            var db_data = readDBData();
            var username_c = cipher.encode(username);

            var users = db_data.dbu.filter(function (item) {
                return (item.u === username_c);
            });

            if (users.length !== -1) {
                has_perm = u_perm.checkUserPerm(users[0], perm);
            }
        }

        return has_perm;
    };
    
    /**
     * @param {String} username
     *
     * @returns {String}
     * 
     * @description Gets the user permissions.
     */
    db_api.get_user_perms = function(username){
        var perm = '';
        
        if (checkDBUserExists(username)) {
            var db_data = readDBData();
            var username_c = cipher.encode(username);
            
            var users = db_data.dbu.filter(function (item) {
                return (item.u === username_c);
            });

            if(users.length!==0){
                perm = cipher.decode(users[0].up);
            }
        }
        
        return perm;
    };
    
    /**
     * @param {String} arr_perm
     * 
     * @returns {Object}
     * 
     * @description This function is an adaptador of function 
     *              with the name 'getPermissionsForWeb' on 'user_permissions' 
     *              module.
     */
    db_api.getPermissionsForWeb = function(arr_perm){
        return u_perm.getPermissionsForWeb(arr_perm);
    };
    
    
    /**
     * @returns {int}
     * 
     * @description Counts how many admins the DB System has.
     */
    db_api.getAdminsLength = function(){
        var db_data = readDBData();
        var admins = db_data.dbu.filter(function(item){
            return (cipher.decode(item.up).indexOf(user_perm.ADMIN)!==-1);
        });
        
        return admins.length;
    };
    
    
    /**
     * @returns {Object[]}
     * 
     * @description Gets all the users.
     */
    db_api.getUsersList = function(){
        var db_data = readDBData();
        return db_data.dbu;
    };
    
    
    db_api.refreshDBData = refreshDBData;
    
    return db_api;
};
