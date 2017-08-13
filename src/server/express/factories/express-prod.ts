import * as express from 'express';
import { interfaces } from 'inversify';
import * as path from 'path';
import { useContainer, useExpressServer } from 'routing-controllers';
import { CardSetController } from 'src/server/express/controllers/CardSet';
import { registry } from 'src/server/registry';

export const expressWebAppProdFactory: interfaces.FactoryCreator<
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
  // Setup express to serve static files
  app.use(express.static(path.resolve(__dirname, 'client', 'assets')));
  app.use(express.static(path.resolve(__dirname, 'client')));

  // Catch all route to support Angular 2 pushstate routing
  app.get('*', (_req: express.Request, res: express.Response): void => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
  });
  context.container.get<interfaces.Factory<express.Application>>(
    registry.ExpressErrorConfig
  )(app);

  return app;
};
