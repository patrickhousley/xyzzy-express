// Vendor Imports
import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import StatsPlugin from 'stats-webpack-plugin';
import _ from 'lodash';

// Module Imports
import baseConfig from './base.config'
import * as paths from '../paths';

let config = _.cloneDeep(baseConfig);

// Ignore built in node modules
config.target = 'node';
// Ignore modules in node_modules
config.externals = [nodeExternals()];

config.entry = {
  'server': [path.join(paths.serverSrc, 'server.ts')]
};

export default function serverConfig(options = {}) {
  if (options.watch) {
    config.watch = true;
    config.cache = true;
  }

  return config;
}
