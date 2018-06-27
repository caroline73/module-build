const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = function(config) {
  const plugins = [];
  if (config.NODE_ENV == 'production') {
    plugins.push(
      new CleanWebpackPlugin(['dist/*.*'], {
      root: config.project_path,
      verbose: false
    }));
  }
  if (config.vue) {
    plugins.push(new VueLoaderPlugin());
  }

  plugins.push(new MiniCssExtractPlugin({ filename: 'index.css'}));

  return plugins;
};
