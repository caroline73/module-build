// 入口文件
const path = require('path');
const fs = require('fs');
const { print, readDir } = require('./util');
const runPath = process.cwd();

module.exports = function(param) {
  let projectPath;
  let workingPath;
  const currArr = runPath.split(path.sep);
  if (fs.existsSync(path.resolve(runPath, 'src'))) {
    projectPath = runPath;
  } else if (currArr[currArr.length - 1] === 'src') {
    projectPath = path.resolve(runPath, '..');
  } else if (currArr[currArr.length - 2] === 'src') {
    projectPath = path.resolve(runPath, '..', '..');
  }
  if (!projectPath) {
    print(function(chalk) {
      return chalk.red('Can`t found working path. Please make sure that you are in the correct directory!');
    });
    return;
  }
  workingPath = path.resolve(projectPath, 'src');
  process.env.TASK = param.task === 'server' ? 'development' : 'production';
  process.env.WORKING_PATH = workingPath;
  process.env.PROJECT_PATH = projectPath;
  process.env.CMD_RUN_PATH = runPath;
  process.env.LIBRARY = param.lib || '';
  process.env.VUE = readDir('src', '.vue');

  require('./config/index.js');
};

