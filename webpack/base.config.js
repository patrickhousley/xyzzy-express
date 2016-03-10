// Vendor Imports
import path from 'path';
import webpack from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';

// Module Imports
import * as paths from '../paths';

let baseConfig = {
  profile: true,
  output: {
    filename: '[name].pkgd.js',
    chunkFilename: '[name].[id].chunk.js',
    path: path.join(paths.dist, 'scripts')
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
      paths.src,
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
  baseConfig.devtool = 'cheap-source-map';
  baseConfig.plugins.push(
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
  baseConfig.devtool = 'eval';
}

export default baseConfig;
