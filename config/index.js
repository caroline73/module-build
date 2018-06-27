const path = require('path');
const os = require('os');
const fs = require('fs');
const CliTable = require('cli-table');
const { print } = require('../util');
const getPort = require('get-port');
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;

let options = {
  vue: false,
  domain: '',
  port: 0,
  exclude: ['common', 'vue-common'],
  ssl: true,
  iSSLHost: '', // ssl图片域名,
  sSSLHost: '', // ssl静态资源域名,
  cache: true
}

function checkIP() {
  const hostname = os.hostname();
  const map = {
    dev02: '10.0.0.1',
    dev04: '10.0.0.4',
    dev05: '10.0.0.5',
    dev09: '10.0.0.9'
  };
  const matches = hostname.match(/(dev0\d+)/);
  if (matches && matches[0]) {
    if (!map[matches[0]]) {
      console.log('没有检测到ip地址');
      return '';
    } else {
      return map[matches[0]];
    }
  }
  return '';
}

function render(template, data) {
  var pattern = /\{(\w*[:]*[=]*\w+)\}(?!})/g;
  return template.replace(pattern, function(match, key, value) {
    return data[key];
  });
}

function initNgx(port, ip) {
  const uri = `http:\/\/${ip}:${port}`;
  console.log(uri);
  const regx = /[\-|_]/g;
  const paths = process.env.PROJECT_PATH.split('/');
  const prefix = paths[paths.length - 1].replace(regx, '.');
  const domain = process.env.USER + '.' + prefix + '.example';
  const filename = 'tpl_' + paths[paths.length - 1] + '_ngx.conf';
  const usedFileName = process.env.USER + '_' + paths[paths.length - 1] + '_ngx.conf';
  const file = process.env.PROJECT_PATH + '/conf/' + filename;
  const usedFile = process.env.PROJECT_PATH + '/conf/' + usedFileName;
  const content = fs.readFileSync(file, 'utf-8');
  fs.writeFileSync(usedFile, render(content, {
    domain: domain,
    uri: uri
  }), 'utf-8');
  console.log('\n 启动ngx 请输入密码');
  console.log('/usr/local/nginx/conf/include/' + filename);
  if (fs.existsSync('/usr/local/nginx/conf/include/' + filename)) {
    execSync('sudo rm /usr/local/nginx/conf/include/' + filename, {
      stdio: [process.stdin, process.stdout, process.stderr]
    });
  }
  execSync('sudo ln -s ' + usedFile + ' /usr/local/nginx/conf/include' + ';' +
    'sudo nginx -s reload', {
    stdio: [process.stdin, process.stdout, process.stderr]
  });
  console.log('\n ngx 启动完成');
  return domain;
}

// 共同的参数
options = Object.assign(
  options, {
    NODE_ENV: process.env.TASK === 'development' ? 'development' : 'production',
    vue: !((process.env.VUE).length == 0),
    working_path: process.env.WORKING_PATH,
    project_path: process.env.PROJECT_PATH,
    lib: process.env.LIBRARY
  }
);

let webpackConfig;
if (options.NODE_ENV == 'development') {
  const ip = checkIP();
  getPort().then(p => {
    const uri = initNgx(p, ip);
    options = Object.assign(
      options, {
        domain: uri,
        port: p,
        ip
      }
    );
    webpackConfig  = path.resolve(__dirname, 'webpack.dev.js');

    spawn('node', [
      webpackConfig,
      '--config', JSON.stringify(options)
    ], {
      stdio: 'inherit'
    });
  });
} else {
  const startTs = Date.now();
  webpackConfig = path.resolve(__dirname, 'webpack.prod.js')
  spawn('node', [
    webpackConfig,
    '--config', JSON.stringify(options)
  ], {
    stdio: 'inherit'
  }).on('close', (code) => {
    if (code === 0) {
      const costTime = ((Date.now() - startTs) / 1000).toFixed(3);
      const table = new CliTable();
      table.push(
        ['version', require('../package.json').name + ' ' + require('../package.json').version],
        ['time', costTime + 's'],
      );
      print(function(chalk) {
        return chalk.green('[webpack-online-done].');
      });
      print(c => c.green('Thank you!\n' + table));
    }
  });
}
