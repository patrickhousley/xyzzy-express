const path = require('path');
const webpack = require('webpack');

const environment = process.env.NODE_ENV || 'development';

module.exports = {
  devtool: environment === 'development'
    ? 'source-map'
    : '',
  performance: {
    hints: environment === 'development'
      ? 'warning'
      : false
  },
  resolve: {
    extensions: [ '.ts', '.js', '.json' ],
    modules: [
      'node_modules',
      '.'
    ]
  },
  output: {
    path: path.join(__dirname, '..', '..', 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};