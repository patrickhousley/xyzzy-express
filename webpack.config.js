// Vendor Imports
import path from 'path';
import webpack from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';

// Module Imports
import * as paths from './paths';

let webpackConfig = {
  profile: true,
  entry: {
    'client': [paths.clientEntrypoint]
  },
  output: {
    filename: '[name].pkgd.js',
    chunkFilename: '[name].[id].chunk.js',
    path: paths.dist
  },
  module: {
    preLoaders: [],
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ],
    postLoaders: []
  },
  resolve: {
    modulesDirectories: [
      path.join(paths.root, 'node_modules')
    ],
    extensions: ['', '.ts', '.js', 'coffee', '.json']
  },
  plugins: [
    new StatsPlugin('webpack-stats.json', {
      chunkModules: true,
      exclude: []
    })
  ]
};

if (process.env.NODE_ENV ==='production') {
  webpackConfig.devtool = 'cheap-source-map';
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: {
        except: ['angular']
      },
      compress: {
        warnings: false
      }
    })
  );
} else {
  webpackConfig.devtool = 'eval';
}

export default webpackConfig;
