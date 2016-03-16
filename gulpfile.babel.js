// Vendor Imports
import gulp from 'gulp';
import gutil from 'gulp-util';
import filter from 'gulp-filter';
import runSequence from 'run-sequence';
import path from 'path';
import del from 'del';
import webpack from 'webpack';
import server from 'gulp-express';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import * as isparta from 'isparta';
import karma from 'karma';

// Module Imports
import * as paths from './paths';
import webpackConfig from './webpack.config';

/******************************************************************************
* Common and Default Section
*******************************************************************************/

gulp.task('default', ['clean:dist'], () => {
  runSequence(
    ['watch', 'webpack:watch']
  );
});

gulp.task('build', ['clean:dist'], (cb) => {
  runSequence(
    ['test:coverage:server'],
    ['webpack:build'],
    cb
  );
});

gulp.task('test', ['clean:dist'], (cb) => {
  runSequence('test:coverage:server', cb);
});

gulp.task('clean:dist', (callback) => {
  return del(paths.dist);
});

/******************************************************************************
* Webpack Section
*******************************************************************************/

gulp.task('webpack:build', (cb) => {
  let compiler = webpack([webpackConfig]);
  compiler.run((err, stats) => {
    gutil.log(
      stats.toString({
        colors: true,
        assets: false,
        chunkModules: false
      })
    );

    cb();
  });
});

gulp.task('webpack:watch', () => {
  let configOptions = {
    watch: true
  };

  let compiler = webpack([serverConfig(configOptions), clientConfig(configOptions)]);
  compiler.watch({}, (err, stats) => {
    gutil.log(
      stats.toString({
        colors: true,
        assets: false,
        chunkModules: false
      })
    );
  });
});

/******************************************************************************
* Server Testing Section
*******************************************************************************/
let serverSources = [
  path.join(paths.root, 'models', '**', '*.js'),
  path.join(paths.root, 'controllers', '**', '*.js')
];
let serverTestSources = [
  path.join(paths.serverTests, '**', '*.js')
];

gulp.task('test:coverage:server', (cb) => {
  runSequence('coverage:instrument:server', 'test:server', 'coverage:report:server', cb);
});

gulp.task('test:server', () => {
  return gulp.src(serverTestSources)
    .pipe(mocha());
});

gulp.task('coverage:instrument:server', () => {
  return gulp.src(serverSources)
  .pipe(istanbul({
    instrumenter: isparta.Instrumenter,
    includeUntested: true
  }))
  .pipe(istanbul.hookRequire());
});

gulp.task('coverage:report:server', () => {
  return gulp.src(serverSources)
  .pipe(istanbul.writeReports({
    dir: path.join(paths.dist, 'coverage', 'server'),
    reporters: ['html', 'lcov', 'json', 'text', 'text-summary']
  }));
});

/******************************************************************************
* Express Server Section
*******************************************************************************/

gulp.task('express', () => {
  server.run([path.join(paths.dist, 'bin', 'server.pkgd.js')]);
});

/******************************************************************************
* Gulp Watch Section
*******************************************************************************/

gulp.task('watch', () => {
  runSequence(
    [
      'express',
      'webpack:watch'
    ],
    [
      'tdd:server'
    ]
  );
});

gulp.task('tdd:server', () => {
  gulp.watch([].concat(serverSources).concat(serverTestSources), ['test:coverage:server'])
  .on('error', gutil.log);
});
