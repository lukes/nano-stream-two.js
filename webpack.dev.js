const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outDir = path.resolve(__dirname, 'preview');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: outDir,
  },
  plugins: [
    new CleanWebpackPlugin(outDir),
  ],
  output: {
    path: path.resolve(__dirname, outDir),
    filename: 'app.js',
  },
});
