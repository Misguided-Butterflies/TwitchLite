var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client');
var APP_DIR = path.resolve(__dirname, 'client/src');

var isProduction = process.argv.indexOf('--prod') !== -1;
var plugins = [];

// At the very least, ensure we set up our Twitch client id env var
var environmentPluginConfig = {
  'process.env': {
    'TWITCH_CLIENT_ID': JSON.stringify(process.env.TWITCH_CLIENT_ID)
  }
};

if (isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  // If production we also want to also set the NODE_ENV env var so that React is
  // properly minified (see https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build)
  environmentPluginConfig['process.env']['NODE_ENV'] = JSON.stringify('production');
}

plugins.push(new webpack.DefinePlugin(environmentPluginConfig));

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
