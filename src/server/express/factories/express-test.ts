import * as express from 'express';
import { interfaces } from 'inversify';
import { useContainer, useExpressServer } from 'routing-controllers';
import { CardSetController } from 'src/server/express/controllers/CardSet';
import { registry } from 'src/server/registry';

export const expressWebAppTestFactory: interfaces.FactoryCreator<
  express.Application
> = (context: interfaces.Context) => (app?: express.Application) => {
  if (!app) {
    app = express();
  }
  context.container.get<interfaces.Factory<express.Application>>(
    registry.ExpressConfig
  )(app);
  useContainer(context.container);
  useExpressServer(app, {
    routePrefix: '/api',
    controllers: [
      CardSetController
    ],
    development: false,
    validation: { validationError: { target: false, value: false } }
  });
  context.container.get<interfaces.Factory<express.Application>>(
    registry.ExpressErrorConfig
  )(app);

  return app;
};
