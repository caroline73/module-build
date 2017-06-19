'use strict';
var minimist = require('minimist');

// console.log(process.env);

var options = minimist(process.argv.slice(2), {
  string: ['projPath']
});

process.env.projPath = options.projPath;

var requireDir = require('require-dir');

requireDir('./tasks', { recurse: true });

