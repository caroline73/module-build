const path = require('path');

module.exports = {
  context: path.join(process.env.PROJECT_PATH, 'src'),
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.join(process.env.PROJECT_PATH, 'dist/')
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, '..', 'node_modules')]
  }
}

