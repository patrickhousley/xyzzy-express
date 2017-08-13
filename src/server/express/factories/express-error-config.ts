import * as express from 'express';
import { interfaces } from 'inversify';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/shared/services/Settings.interface';

/* tslint:disable:no-require-imports no-var-requires typedef */
const expressWinston = require('express-winston');
/* tslint:enable:no-require-imports no-var-requires typedef */

export const expressErrorConfigFactory: interfaces.FactoryCreator<
  express.Application
> = (context: interfaces.Context) => (app: express.Application) => {
  const settings = context.container.get<SettingsServiceAttributes>(
    registry.SettingsService
  );
  app.use(
    expressWinston.errorLogger({
      transports: settings.loggerTransports,
      requestWhitelist: [],
      msg: '{{req.method}} {{req.url}} => {{res.statusCode}}: {{err.message}}'
    })
  );

  /* tslint:disable:no-void-expression */
  /**
   * Add a final error handler that will prevent the Express final error handler from executing
   * when routing-controllers error handler or any other error handler has already sent headers
   * and data.
   * See https://github.com/pleerock/routing-controllers/issues/243
   */
  app.use(
    (
      error: Error,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (res.headersSent || res._header) {
        return next();
      }

      return next(error);
    }
  );
  /* tslint:enable:no-void-expression */

  return app;
};
