/// <reference path='../../typings/main.d.ts' />

import debug = require('debug');
import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');

let logger = debug('xyzzy:server');
let port: number = process.env.PORT || 3000;
let app = express();
let env: string = process.env.NODE_ENV || 'development';

logger('Loading express server.');
logger('Environment: %s', env);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let router = express.Router();

router.get('/', (req, res, next) => {
  res.send({ message: 'Hello, world!' });
});

app.use('/api', router);


// var renderIndex = (req: express.Request, res: express.Response) => {
//     res.sendFile(path.resolve(__dirname, 'index.html'));
// }
//
// app.get('/*', renderIndex);

const server = app.listen(port, () => {
  logger('Express app loaded listening on port: %s', port);
});
