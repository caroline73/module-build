'use strict';

var path = require('path');

// console.log(path.join(process.env.projPath, '/demo'));

module.exports = {
  demoDir: path.join(process.env.projPath, '/demo'),
  distDir: path.join(process.env.projPath, '/dist'),
  imgDir: path.join(process.env.projPath, '/img'),
  srcDir: path.join(process.env.projPath, '/src'),
  tmpDir: path.join(process.env.projPath, '/.tmp'),
  cdnDir: [path.join(process.env.projPath, '/.tmp') + '/**', '!' + path.join(process.env.projPath, '/.tmp') + '/{.img,img/**}']
};
