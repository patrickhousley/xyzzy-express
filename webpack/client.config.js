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

config.entry = {
  'client': [paths.clientEntrypoint]
};

export default function clientConfig(options = {}) {
  if (options.watch) {
    config.watch = true;
    config.cache = true;
  }

  return config;
}
