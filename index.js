var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

var projectPath;

module.exports = function(task) {
  var currPath = process.cwd();
  var currArr = currPath.split(path.sep);

  if (fs.existsSync(path.resolve(currPath, 'src'))) {
    projectPath = currPath;
  } else {
    
  } 

  if (task !== 'online') {
    task = 'build:' + task;
  }
  var mb = spawn('node', [
    path.join(__dirname, '/node_modules/gulp/bin/gulp.js'),
    '--gulpfile',
    path.join(__dirname, '/gulpfile.js'),
    task,
    '--projPath',
    projectPath
  ], {
    stdio: [process.stdin, process.stdout, process.stderr]
  });

  mb.on('error', function(err) {
    process.exit(1);
  });
  mb.on('close', function() {
    process.exit(0);
  });
  mb.on('exit', function() {
    process.exit(0);
  });
  mb.on('disconnect', function() {
    process.exit(0);
  });
};

