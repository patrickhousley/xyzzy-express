const cluster = require('cluster');

if(cluster.isMaster) {
  // TODO: Validate the db schema first

  const WORKERS = process.env.WEB_CONCURRENCY || 2;
  console.log('Master cluster setting up ' + WORKERS + ' workers...');

  for(var i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  const app = require('./dist/server-web');
  app.init().catch(error => console.log(error));
}