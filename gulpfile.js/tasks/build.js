'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

var autoPrefix = require('gulp-autoprefixer');
var config = require('../config');

gulp.task('build:dev', function() {
  runSequence('clean', 'dev:noserver', 'watch:images', 'watch:webpack');
});

gulp.task('build:server', function() {
  runSequence('clean', 'dev:server', 'watch:images');
});

gulp.task('build:online', ['clean', 'dev:online'], function(){
  gulp.src(config.tmpDir + '/quiz.css')
    .pipe(autoPrefix('last 5 versions'))
    .pipe(gulp.dest(config.distDir));

  gulp.src(config.tmpDir + '/quiz.js')
    .pipe(gulp.dest(config.distDir));
});

