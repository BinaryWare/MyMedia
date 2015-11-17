var gulp = require('gulp');
var exec = require('child_process').exec;
var CMD = 'jsdoc -r -c jsdoc_config.json -d docs';

gulp.task('default', function(done) {
    exec(CMD, {cwd: '../'}, function(err, stdout, stderr){
        done(err);
    });
});

