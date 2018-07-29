const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nano Block Data Visualizer',
      template: './src/index.html',
    }),
  ],
};
