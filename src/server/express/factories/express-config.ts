
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import { interfaces } from 'inversify';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/shared/services/Settings.interface';

/* tslint:disable:no-require-imports no-var-requires typedef */
const expressWinston = require('express-winston');
/* tslint:enable:no-require-imports no-var-requires typedef */

export const expressConfigFactory: interfaces.FactoryCreator<
  express.Application
> = (context: interfaces.Context) => (app: express.Application) => {
  const settings = context.container.get<SettingsServiceAttributes>(
    registry.SettingsService
  );
  app.use(helmet());
  app.use(compression());
  app.use(
    expressWinston.logger({
      transports: settings.loggerTransports,
      expressFormat: true,
      colorize: false,
      meta: false
    })
  );

  return app;
};
