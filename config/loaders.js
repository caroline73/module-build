const LessPluginFunctions = require('less-plugin-functions');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function(config) {
  const loaders = [];
  loaders.push({
    test: /\.css$/,
    use: [
      'vue-style-loader',
      'css-loader'
    ]
  });
  if (config.NODE_ENV == 'production') {
    loaders.push({
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            data: '$color: red;',
            plugins: [new LessPluginFunctions()]
          }
        }
      ]
    })
  } else {
    loaders.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            data: '$color: red;',
            plugins: [new LessPluginFunctions()]
          }
        }
      ]
    })
  }
  if (config.vue) {
    loaders.push({
      test: /\.vue$/,
      use: [{
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      }]
    });
  } else {
    loaders.push({
      test: /\.js$/,
      use: [
        'babel-loader'
      ]
    }, {
      test:/\.hbs$/,
      use: [
        {
          loader: 'handlebars-loader',
          options: {
            helperDirs: process.env.PROJECT_PATH + 'src/helpers'
          }
        }
      ]
    })
  }

  return loaders;
};
