import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import * as winston from 'winston';
import { interfaces, Container } from 'inversify';
import { TYPE } from 'inversify-express-utils';
import { container as ormContainer } from 'src/server/orm/container';
import { ormErrorHandler } from 'src/server/middleware/orm-error';
import { registry } from 'src/server/registry';
import { sqliteErrorHandler } from 'src/server/middleware/sqlite-error';

/* tslint:disable:no-require-imports no-var-requires typedef */
const expressWinston = require('express-winston');
/* tslint:enable:no-require-imports no-var-requires typedef */

const container = new Container();
container.parent = ormContainer;

/** Services */
import { SettingsServiceAttributes } from 'src/server/services/Settings.interface';
import { SettingsService } from 'src/server/services/Settings';
container
  .bind<SettingsServiceAttributes>(registry.SettingsService)
  .to(SettingsService);

/** Factories */
import { loggerFactory } from 'src/server/factories/logger';
container
  .bind<interfaces.Factory<winston.LoggerInstance>>(registry.LoggerFactory)
  .toFactory(loggerFactory);

/** Middleware */
const settings = container.get<SettingsServiceAttributes>(
  registry.SettingsService
);
container
  .bind<express.RequestHandler>(registry.ExpressBodyParserHandler)
  .toConstantValue(bodyParser.json());
container
  .bind<express.RequestHandler>(registry.ExpressBodyParserEncoderHandler)
  .toConstantValue(bodyParser.urlencoded({ extended: true }));
container
  .bind<express.RequestHandler>(registry.ExpressHelmetHandler)
  .toConstantValue(helmet());
container
  .bind<express.RequestHandler>(registry.ExpressCompressionHandler)
  .toConstantValue(compression());
container
  .bind<express.RequestHandler>(registry.ExpressLoggerHandler)
  .toConstantValue(
    expressWinston.logger({
      transports: settings.loggerTransports,
      expressFormat: true,
      colorize: false,
      meta: false
    })
  );
container
  .bind<express.ErrorRequestHandler>(registry.ExpressErrorLoggerHandler)
  .toConstantValue(
    expressWinston.errorLogger({
      transports: settings.loggerTransports,
      requestWhitelist: [],
      msg: '{{req.method}} {{req.url}} => {{res.statusCode}}: {{err.message}}'
    })
  );
container
  .bind<express.ErrorRequestHandler>(registry.ExpressDBErrorHandler)
  .toConstantValue(ormErrorHandler);
container
  .bind<express.ErrorRequestHandler>(registry.ExpressSQLiteErrorHandler)
  .toConstantValue(sqliteErrorHandler);

/**
 * Express Web Controllers
 * whenTargetNamed must be given a sting equal to the class name of the controller
 */
import { CardSetControllerAttributes } from 'src/server/controllers/CardSet.interface';
import { CardSetController } from 'src/server/controllers/CardSet';
container
  .bind<CardSetControllerAttributes>(TYPE.Controller)
  .to(CardSetController)
  .whenTargetNamed('CardSetController');

export { container };
