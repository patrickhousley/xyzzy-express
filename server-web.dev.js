const path = require('path');

const projectPath = path.resolve(__dirname, 'tsconfig.json');

/**
 * Register ts-node.
 */
require('ts-node').register({
  project: projectPath,
  fast: true,
  compilerOptions: {
    module: 'commonjs' // Must use commonjs for testing
  }
});

/**
 * Register ts-node import plugin.
 */
require('tsconfig-paths').register({
  baseUrl: path.resolve(__dirname),
  paths: require(projectPath).compilerOptions.paths
});

const app = require('./src/server/express/server.dev');
app.init().catch(error => console.log(error));
