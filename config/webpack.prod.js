const webpack = require('webpack');
const minimist = require('minimist');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { print } = require('../util');

const options = minimist(process.argv.slice(2));
const config = JSON.parse(options.config);
const loaders = require('./loaders.js')(config);
let plugins = require('./plugins.js')(config);

const cdnLoader = {
  loader: 'muse-cdn-loader',
  options: {
    ssl: config.ssl,
    iSSLHost: config.iSSLHost, // ssl图片域名,
    sSSLHost: config.sSSLHost, // ssl静态资源域名
    cache: config.project_path + '/cache.json'
  }
}

let rules = [
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      cdnLoader
    ]
  }
];
rules = rules.concat(loaders);

plugins.push(
  new UglifyJSPlugin({
  test: /\.js$/,
  sourceMap: true}),
  new ManifestPlugin()
);
const webpackProd = merge(common, {
  mode: config.NODE_ENV,
  devtool: 'source-map',
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.min.js'
    }
  },
  plugins,
  module: {
    rules
  }
});
webpack(webpackProd, (err) => {
  if (err) {
    print(function(chalk) {
      return chalk.red(`webpack-dev-server err: ${err}`);
    });
  }
});

