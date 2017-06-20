'use strict';

var gulp = require('gulp');
var webpack = require('webpack');
var _ = require('lodash');
var compileLogger = require('../lib/compileLogger');
var config = require('../config');

// gulp.task('watch', [
//   'clean', 'watch:webpack'
// ], function() {
//   gulp.watch(config.imgDir, function() {
//   //   gulp.start('images');
//   });
// });

gulp.task('watch:images', ['clean'], function() {
  gulp.watch(config.imgDir, function() {
  //   gulp.start('images');
  });
});

gulp.task('watch:webpack', function() {
  webpack(_.merge(require('../webpack.config.js')({
    outputs: 'index.js',
    cssfile: 'index.css'
  }), {
    watch: true
  })).watch(200, function(err, stats) {
    compileLogger(err, stats);
    // 该异步任务不需要结束，所以不需要callback
    // 该任务不结束，所以webpack的增量更新由webpack自己完成
  });
});
