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
import serverConfig from './webpack/server.config';
import clientConfig from './webpack/client.config';

gulp.task('default', ['clean:dist'], (callback) => {

});

gulp.task('build', ['clean:dist'], (callback) => {

});

gulp.task('clean:dist', (callback) => {
  return del(paths.dist);
});

gulp.task('webpack:build', (callback) => {
  let compiler = webpack([serverConfig(), clientConfig()]);
  compiler.run((err, stats) => {
    gutil.log(
      stats.toString({
        colors: true,
        assets: false,
        chunkModules: false
      })
    );

    callback();
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

gulp.task('express', () => {
  server.run([path.join(paths.dist, 'server.pkgd.js')]);
});

gulp.task('test', (cb) => {
  new karma.Server({
    configFile: path.join(paths.root, 'karma.conf.js'),
    singleRun: true
  }, cb).start();
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
* Gulp Watch Section
*******************************************************************************/

gulp.task('tdd:server', () => {
  gulp.watch([].concat(serverSources).concat(serverTestSources), ['test:coverage:server'])
  .on('error', gutil.log);
});
