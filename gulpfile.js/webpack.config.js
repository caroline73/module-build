'use strict';

var webpack = require('webpack');
var _ = require('lodash');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
var config = require('./config');
var path = require('path');

module.exports = function(opt) {
return {
    entry: config.srcDir + '/index.js',
    output: {
      path: config.tmpDir,
      publicPath: path.resolve(__dirname, '../'),
      filename: getOutput(opt),
      library: 'Quiz',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    devtool: "eval",
    watch: false,
    profile: true,
    cache: true,
    module: {
      loaders: getLoaders(opt)
    },
    plugins: getPlugins(opt)
  };
};

function getOutput(opt) {
  return opt.outputs;
}

function getLoaders(opt) {
  return [
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader?limit=25000&name=img/[name].[ext]'
    },
    {
      test: /\.hbs$/,
      loader: 'handlebars-loader?helperDirs[]=' + config.srcDir + '/helpers'
    },
    {
      test: /\.(less|css)$/,
      // loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader']})
      loader: 'style-loader!css-loader!less-loader'
    },
    {
      test: /\.js$/,
      enforce: 'post',
      exclude: /node_modules/,
      loader: 'babel-loader'
    }
  ];
}

function getPlugins(opt) {
  var defaultPlugins = [
    // new ExtractTextPlugin(opt.cssfile)
  ];

  var plugins = [];

  if (opt.env === 'production') {
    plugins = _.union(defaultPlugins, [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          properties: false,
          warnings: true,
          drop_console: true
        },
        sourceMap: true
      }),
      new webpack.LoaderOptionsPlugin({
         minimize: true
      }),
      new webpack.NoErrorsPlugin()
    ]);
  } else {
    plugins = _.union(defaultPlugins, []);
  }
  return plugins;
}
