'use strict';

var gulp = require('gulp');
var del = require('del');
var config = require('../config');

gulp.task('clean', function(cb) {
  return del([
    config.distDir,
    config.tmpDir
  ], { force: true }, cb);
});

gulp.task('clean:img', function(cb) {
  return del([
    config.distDir + '/img'
  ], { force: true }, cb);
});
