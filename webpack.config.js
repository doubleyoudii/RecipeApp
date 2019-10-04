const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    path : path.resolve(__dirname, 'dist'),
    filename : 'js/bundle.js'
  },
  devServer: { // in order to configure web server
    //specify which folder will webpack serve
    contentBase: './dist'                //because the dist folder is the folder presented to the viewers
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader : 'babel-loader'
        }
      }
    ]
  }
    
}; 