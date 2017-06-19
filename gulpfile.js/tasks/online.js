'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('online', function() {
  runSequence('clean', 'build:online', 'deploy');
});

