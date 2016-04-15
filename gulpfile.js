var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('runAppGUI', function(done) {
    exec('./node_modules/.bin/electron .', {cwd: './'}, function(err, stdout, stderr){
        done(err);
    });
});

gulp.task('runAppNOGUI', function(done) {
    exec('node mymedia_main.js no_gui', {cwd: './'}, function(err, stdout, stderr){
        done(err);
    });
});

gulp.task('runUnitTestingFUser', function(done) {
    exec('mocha ./test/fusers_test/fusers_unit_test.js && exit', {cwd: './'}, function(err, stdout, stderr){
        done(err);
    });
});

gulp.task('runUnitTestingDB', function(done) {
    exec('mocha ./test/db_test/db_unit_test.js && exit', {cwd: './'}, function(err, stdout, stderr){
        done(err);
    });
});
