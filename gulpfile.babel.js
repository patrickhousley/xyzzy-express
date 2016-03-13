// Vendor Imports
import gulp from 'gulp';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';
import path from 'path';
import del from 'del';
import webpack from 'webpack';
import server from 'gulp-express';
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
})
