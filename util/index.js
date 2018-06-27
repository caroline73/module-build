const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
// const moment = require('moment');

function getTime(date) {
  return '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ']';
}

module.exports = {
  print(...args) {
    // args.unshift('[' + chalk.gray(moment().format('HH:mm:ss')) + ']');
    args.unshift(getTime(new Date));
    args.forEach((item, idx) => {
      if (typeof item === 'function') {
        args[idx] = item(chalk);
      }
    });
    console.log(...args);
  },
  getTime,
  readDir
}
const arr = [];
function readDir(dirname, ext) {
  const dirs = fs.readdirSync(dirname);
  dirs.filter(filename => {
    const fileInfo = fs.statSync(dirname + '/' + filename);
    if (fileInfo.isFile()) {
      if (path.extname(filename) == ext) {
        arr.push(filename);
      }
    } else if (fileInfo.isDirectory()) {
      readDir(dirname + '/' + filename, ext);
    }
  });
  return arr;
}
