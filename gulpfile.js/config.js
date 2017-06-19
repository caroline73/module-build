'use strict';

var path = require('path');

module.exports = {
  demoDir: path.resolve(__dirname, '../demo'),
  distDir: path.resolve(__dirname, '../dist'),
  imgDir: path.resolve(__dirname, '../img'),
  srcDir: path.resolve(__dirname, '../src'),
  tmpDir: path.resolve(__dirname, '../.tmp'),
  cdnDir: [path.resolve(__dirname, '../.tmp') + '/**', '!' + path.resolve(__dirname, '../.tmp') + '/{.img,img/**}']
};
