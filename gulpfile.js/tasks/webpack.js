'use strict';

var gulp = require('gulp');
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");
var _ = require('lodash');
var compileLogger = require('../lib/compileLogger');
var gutil = require('gulp-util');
var config = require('../config');

gulp.task('dev:noserver', function(cb) {
  webpack(_.merge(require('../webpack.config.js')({
    outputs: 'quiz.js',
    cssfile: 'quiz.css'
  }), {
    devtool: false
  }), function(err, stats) {
    compileLogger(err, stats);
    cb();
  });
});


gulp.task('dev:server', function(cb) {
  new WebpackDevServer(
     webpack(_.merge(require('../webpack.config.js')({
       outputs: 'quiz.js',
       cssfile: 'quiz.css'
     }), {
       devtool: false
     }), function(err, stats) {
       compileLogger(err, stats);
       cb();
     }),
      {
        contentBase: config.demoDir,
        port: 9888,
        historyApiFallback: true,
        disableHostCheck: true
        // allowedHosts: [
        //   'zhangshaohui.pgc.com'
        // ]
      }
    ).listen(9888, '10.20.1.19', function(err, stat) {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('[webpack-dev-server]', 'http://10.20.1.19:9888/index.html');
    });
});

gulp.task('build:online', function(cb) {
  webpack(_.merge(require('../webpack.config.js')({
    outputs: 'quiz.js',
    cssfile: 'quiz.css',
    env: 'production'
  }), {
    devtool: false
  }), function(err, stats) {
    compileLogger(err, stats);
    cb();
  });
});
