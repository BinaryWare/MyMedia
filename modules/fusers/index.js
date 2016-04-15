/**
 * @module FUsers
 */

var FUSER_DIR = 'fu';
var fs = require('fs');
var fs_e = require('fs-extra');
var console = require('../console');

/**
 * @returns {undefined}
 *
 * @description Checks if the native folder exists.
 */
function checkNativeFolder() {
    try {
        fs.readdirSync(FUSER_DIR);
    } catch (ex) {
        console.error('Module Error (FUser) --> '+ex);
        console.warn('--> Creating Folder...');
        fs.mkdirSync(FUSER_DIR);
    }
}

/**
 *
 * @param {String} dir
 *
 * @returns {String}
 *
 * @description Checks the directory pattern.
 */
function checkdirPattern(dir) {
    var PATTERN = '../';
    var res_dir = dir;
    if (dir.indexOf(PATTERN) !== -1)
        res_dir = dir.replace(PATTERN, '');

    return res_dir;
}

/**
 *
 * @param {String} user_id
 * @param {String} path
 *
 * @returns {String}
 *
 * @description Formats and return all the path of user files.
 */
function formatUserDir(user_id, path) {
    var fullPath = (FUSER_DIR + '/' + user_id);
    var dirPattern = checkdirPattern(path);

    if(path!=='')
        fullPath += dirPattern;

    return fullPath;
}

/**
 *
 * @param {String} user_id
 * @param {String} path
 *
 * @returns {String[]}
 *
 * @description Reads all the directory.
 */
function readDir(user_id, path) {
    var res = null;

    try {
        var user_path = formatUserDir(user_id, path);

        res = fs.readdirSync(user_path);
        res = res.map(function (fitem) {
            var item = {
                isFile: fs.lstatSync(user_path + fitem).isFile(),
                name: fitem
            };

            return item;
        });
    } catch (ex) {
        fs.mkdirSync(formatUserDir(user_id, ''));
        res = [];
    }

    return res;
}

/**
 *
 * @param {String} user_id
 *
 * @returns {undefined}
 *
 * @description Deletes all user folder. This will delete all files and sub dirs
 *              of the user.
 */
function deleteDir(user_id) {
    fs_e.removeSync(FUSER_DIR + '/' + user_id);
}

/**
 * @param {String} userid
 * @param {String} filename
 * @param {String} path
 *
 * @description Checks if the file exists.
 *
 * @returns {boolean}
 */
function isFileExists(userid, filename, path) {
    if(path===undefined)
        path = '';

    var res = true;
    try {
        fs.openSync(formatUserDir(userid, path) + checkdirPattern(filename), 'r');
    } catch (ex) {
        res = false;
    } finally {
        return res;
    }
}

/**
 * @param {String} userid
 * @param {String} filename
 * @param {String} path
 *
 * @description Checks if is a directory.
 *
 * @returns {boolean}
 */
function isDir(userid, filename, path){
    if(path===undefined)
        path = '';

    var dir_code;
    try {
      dir_code = fs.openSync(formatUserDir(userid, path) + checkdirPattern(filename), 'r');
    } catch (ex) {
      dir_code = -1
    } finally {
      return (dir_code===4);
    }
}

module.exports = function () {
    var fuser_api = {};

    checkNativeFolder();

    /**
     *
     * @param {String} user_id
     * @param {String} path
     *
     * @returns {String[]}
     *
     * @description Reads all the directory.
     */
    fuser_api.readUserDir = function (user_id, path) {
        return readDir(user_id, path);
    };

    /**
     *
     * @param {String} user_id
     * @param {String} path
     * @param {String} filename
     * @param {String} file_data
     * @param {function} callback
     *
     * @returns {undefined}
     *
     * @description Creates a file with all the data.
     */
    fuser_api.writeUserFile = function (user_id, path, filename, file_data, append_data, callback) {
        var file_full_path = formatUserDir(user_id, path) + checkdirPattern(filename);

        if(!append_data){
            var fileWriteStream = fs.createWriteStream(file_full_path);

            fileWriteStream.on('finish', function() {
                callback();
            });

            fileWriteStream.write(file_data);
            fileWriteStream.end();
        }else{
            fs.appendFile(file_full_path, file_data, function(){
                callback();
            });
        }
    };

    /**
     *
     * @param {String} user_id
     * @param {String} path
     * @param {String} filename
     *
     * @returns {String}
     *
     * @description Reads all the user file.
     */
    fuser_api.readUserFile = function (user_id, path, filename) {
        var file = null;

        try {
            file = fs.readFileSync(formatUserDir(user_id, path) + checkdirPattern(filename));
        } catch (ex) {}

        return file;
    };

    /**
     *
     * @param {String} user_id
     * @param {String} path
     * @param {String} filename
     *
     * @returns {boolean}
     *
     * @description Deletes the file and return if the user file was deleted or not.
     */
    fuser_api.deleteUserFile = function (user_id, path, filename) {
        var res = true;
        try {
            fs_e.removeSync(formatUserDir(user_id, path) + checkdirPattern(filename));
        } catch (ex) {
            res = false;
        }

        return res;
    };

    /**
     * @param {String} user_id
     *
     * @returns {undefined}
     *
     * @description Creates the user directory.
     */
    fuser_api.createUserDir = function(user_id){
        fs.mkdirSync(formatUserDir(user_id, ''));
    };

    /**
     *
     * @param {String} user_id
     *
     * @returns {undefined}
     *
     * @description Deletes all user folder. This will delete all files and sub dirs
     *              of the user.
     */
    fuser_api.deleteUserDir = function (user_id) {
        deleteDir(user_id);
    };


    /**
     * @param {String} user_id
     *
     * @returns {boolean}
     *
     * @description Checks if the directory of a specified user exists or not.
     */
    fuser_api.isUserDirExists = function(user_id){
        var exists = true;
        try{
            fs.readDirSync(formatUserDir(user_id, ''));
        }catch(ex){
            exists = false;
        }

        return exists;
    };

    fuser_api.isFileExists = isFileExists;
    fuser_api.isDir = isDir;

    return fuser_api;
};
