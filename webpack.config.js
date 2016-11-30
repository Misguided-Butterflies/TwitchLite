var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client');
var APP_DIR = path.resolve(__dirname, 'client/src');

var isProduction = process.argv.indexOf('--prod') !== -1;
var plugins = [];

plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'TWITCH_CLIENT_ID': JSON.stringify(process.env.TWITCH_CLIENT_ID)
  }
}));

if (isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

var config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  plugins: plugins,
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
