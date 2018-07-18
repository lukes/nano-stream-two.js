const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outDir = path.resolve(__dirname, 'dist');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(outDir),
  ],
  output: {
    path: outDir,
    filename: 'app.js',
  },
});
