(function () {
  'use strict';

  var path = require('path');
  var paths = require('./paths');

  var babelPolyfills = path.join(paths.root, 'node_modules', 'babel-polyfill', 'dist', 'polyfill.js');
  var testsPath = path.join(paths.root, 'tests', '**', '*.spec.js');

  module.exports = function(config) {
    config.set({
      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: paths.root,
      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ['jasmine'],
      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['progress', 'dots', 'coverage'],
      // web server port
      port: 9876,
      // enable / disable colors in the output (reporters and logs)
      colors: true,
      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,
      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['PhantomJS'],
      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: false,
      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity,
      plugins: [
        'karma-commonjs',
        'karma-babel-preprocessor',
        'karma-jasmine',
        'karma-mocha',
        'karma-webpack',
        'karma-coverage',
        'karma-chrome-launcher',
        'karma-phantomjs-launcher'
      ],

      // list of files / patterns to load in the browser
      files: [
        babelPolyfills,
        testsPath
      ],
      // list of files to exclude
      exclude: [
      ],
      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        testsPath: ['babel']
      }
    });
  };
})();
