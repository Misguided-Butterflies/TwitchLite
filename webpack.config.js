var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client');
var APP_DIR = path.resolve(__dirname, 'client/src');

var definePlugin = new webpack.DefinePlugin({
  'process.env': {
    'TWITCH_CLIENT_ID': JSON.stringify(process.env.TWITCH_CLIENT_ID)
  }
});

var config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  plugins: [definePlugin],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline',
        include: path.join(__dirname, 'client/src')
      }
    ]
  }
};

module.exports = config;
