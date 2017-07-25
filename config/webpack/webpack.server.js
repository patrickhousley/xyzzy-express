const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');
const webpackMerge = require('webpack-merge');

const environment = process.env.NODE_ENV || 'development';
const extraPlugins = [];

if (environment !== 'production') {
  extraPlugins.push(
    new StatsPlugin('server-stats.json', 'verbose')
  );
}

module.exports = webpackMerge.smart(commonConfig, {
  target: 'node',
  externals: [nodeExternals()],
  entry: {
		'server-web': './src/server/server-web.prod.ts'
	},
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [
          /\.(spec|e2e)\.ts$/
        ],
        use: [
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      }
    ]
  },
  node: {
    global: true,
    crypto: true,
    __dirname: false,
    __filename: true,
    process: true,
    Buffer: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..', '..')
    })
  ].concat(extraPlugins)
});
