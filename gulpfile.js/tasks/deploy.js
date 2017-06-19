'use strict';

/**
 *将图片地址替换为静床地址
 * */

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var cdnImage = require('gulp-cdn-image');
var config = require('../config');


gulp.task('deploy', function(cb) {
  return gulpSequence('deploy:img', 'clean:img', cb);
});

gulp.task('deploy:img', function() {
  return gulp.src(config.cdnDir)
    .pipe(cdnImage({
      host: 'i.h2.pdim.gs'
    }))
    .on('error', function(err) {
      //process.exit(1);
    })
    .pipe(gulp.dest(config.distDir));
});

