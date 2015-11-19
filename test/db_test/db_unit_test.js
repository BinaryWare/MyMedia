var db = require('../../modules/db')();
var assert = require('assert');
var TEST_USERNAME = 'test_db';
var TEST_PASSWORD = '12345678';
var TEST_ALTER_PASSSWORD = '0123abcdef';


describe('DB Test', function(){
    it('DB Admin Login', function(done){
        var isLoginSuccess = db.do_login('admin', 'myM3D1@localadmin.loc');
        assert.equal(true, isLoginSuccess);
        done();
    });
    
    it('DB Add Test User', function(done){
        var isUserCreated = db.add_user(TEST_USERNAME, TEST_PASSWORD, false, true, true);
        
        assert.equal(true, isUserCreated);
        done();
    });
    
    it('DB Check Test User', function(done){
        var isUserExists = db.check_user_exists(TEST_USERNAME);
        assert.equal(true, isUserExists);
        done();
    });
    
    it('DB Edit Test User', function(done){
        var isUserEdited = db.edit_user(TEST_USERNAME, TEST_ALTER_PASSSWORD, TEST_PASSWORD);
        assert.equal(true, isUserEdited);
        done();
    });
    
    it('DB Delete User', function(done){
        var isUserDeleted = db.del_user(TEST_USERNAME, TEST_ALTER_PASSSWORD);
        assert.equal(true, isUserDeleted);
        done();
    });
});

