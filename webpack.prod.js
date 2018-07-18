const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const outDir = path.resolve(__dirname, 'dist');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(outDir),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  output: {
    path: outDir,
    filename: 'app.js',
  },
});
