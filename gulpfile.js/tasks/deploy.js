'use strict';

/**
 *将图片地址替换为静床地址
 * */

var gulp = require('gulp');
var chalk = require('chalk');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var cdnImage = require('gulp-cdn-image');
var uploadDispatch = require('g-upload-image');
var through = require('through2');
var path = require('path');
var config = require('../config');


gulp.task('deploy', function(cb) {
  return runSequence('deploy:img', 'deploy:css', 'clean:img', cb);
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

gulp.task('deploy:css', function() {
  return gulp.src(path.resolve(config.distDir, 'quiz.css'))
    .pipe(function(options) {
      return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
          return cb(null, file);
        }
        if (file.isStream()) {
          return cb(new gutil.PluginError('build-hbs', chalk.red('Streaming not supported')));
        }
        uploadDispatch.upload({
          file: path.resolve(config.distDir, 'quiz.css')
        }, function(err, data) {
          if (err) {
            return console.log('上传失败，原因是: ' + err);
          }
          if (data) {
            for(var k in data) {
              console.log('上传文件: ' + k + '成功,地址是:\n' + data[k]);
            }
          }
          cb(null, file);
        });
      });
    }());
});

gulp.task('deploy:js', function() {

});

