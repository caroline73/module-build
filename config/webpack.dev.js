const minimist = require('minimist');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const { print, getTime } = require('../util');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const webpackDevServer =  require('webpack-dev-server');

const options = minimist(process.argv.slice(2));
const config = JSON.parse(options.config);
const loaders = require('./loaders.js')(config);
const plugins = require('./plugins.js')(config);

function reporter (middlewareOptions, options) {
  const { log, state, stats } = options;
  if (state) {
    const displayStats = (middlewareOptions.stats !== false);
    if (displayStats) {
      if (stats.hasErrors()) {
        log.error(getTime(new Date()) + ' ' +stats.toString(middlewareOptions.stats));
      } else if (stats.hasWarnings()) {
        log.warn(getTime(new Date()) + ' ' +stats.toString(middlewareOptions.stats));
      } else {
        log.info(getTime(new Date()) + ' ' +stats.toString(middlewareOptions.stats));
      }
    }
    let msg = "Compiled successfully.";
    if (stats.hasErrors()) {
      msg = "Failed to compile.";
      log.info(chalk.red(getTime(new Date()) + "---webpack: " + msg));
      return;
    } else if(stats.hasWarnings()) {
      msg = "Compiled with warnings.";
      log.info(chalk.orange(getTime(new Date()) + "---webpack: " + msg));
      return;
    }
    log.info(chalk.green(getTime(new Date()) + "---webpack: " + msg));
  } else {
    log.info(chalk.green(getTime(new Date()) + "---webpack: Compiling..."));
  }
}

let output = {}

if (config.lib) {
  output = _.merge(output, {
    library: config.lib,
    libraryTarget: 'umd',
    umdNamedDefine: true
  });
}

let rules = [
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      { 
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  }
];
rules = rules.concat(loaders);

const webpackDev = merge(common, {
  output,
  mode: config.NODE_ENV,
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.js'
    }
  },
  module: {
    rules
  },
  plugins
});
new webpackDevServer(webpack(webpackDev), {
  port: config.port,
  historyApiFallback: true,
  disableHostCheck: true,
  inline: true,
  watchOptions: {
    aggregateTimeout: 30,
    poll: 100
  },
  reporter,
  contentBase: path.join(config.project_path, '/demo')
}).listen(config.port, config.ip, function(err) {
  print(function(chalk) {
    if (err) {
      return chalk.red(`webpack-dev-server err: ${err}`);
    }
    return chalk.green(`[webpack-dev-server]: http://${config.domain}`);
  });
});

