var fuser = require('../../modules/fusers')();
var assert = require('assert');
var USER_ID = 'test_user';
var FILENAME_INFO = 'test.json';
var INFILE_INFO = '{ "data":"Hello World Test" }';

describe('Files Users Test', function() {
    it('Should create Directory', function(done){
        fuser.createUserDir(USER_ID);
        done();
    });
    
    it('Should create a file with some data.', function(done){
        fuser.writeUserFile(USER_ID, '', FILENAME_INFO, INFILE_INFO);
        done();
    });
    
    it('Should reads the file and delete it!', function(done){
        var f_info = fuser.readUserFile(USER_ID, '', FILENAME_INFO);
        assert.equal(INFILE_INFO, f_info);
        done();
    });
    
    it('Should delete all user info and directory.', function(done){
        fuser.deleteUserDir(USER_ID);
        done();
    });
});

