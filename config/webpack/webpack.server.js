const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge.smart(commonConfig, {
  target: 'node',
  externals: [nodeExternals()],
  entry: {
		'server-web': './src/server/express/server.prod.ts'
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
    new StatsWriterPlugin({
      filename: 'server-stats.json',
      fields: null
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..', '..')
    })
  ]
});
