import * as express from 'express';
import * as path from 'path';
import { interfaces } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { registry } from 'src/server/registry';

export const expressWebAppProdFactory: interfaces.FactoryCreator<
  express.Application
> = (context: interfaces.Context) => {
  return () => {
    const app = express();
    const server = new InversifyExpressServer(context.container);
    context.container.get<interfaces.Factory<express.Application>>(
      registry.BaseExpressConfig
    )(app);
    app.use('/api', server.build());
    // Setup express to serve static files
    app.use(express.static(path.resolve(__dirname, 'client', 'assets')));
    app.use(express.static(path.resolve(__dirname, 'client')));

    // Catch all route to support Angular 2 pushstate routing
    app.get('*', (_req: express.Request, res: express.Response): void => {
      res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
    });
    context.container.get<interfaces.Factory<express.Application>>(
      registry.BaseExpressErrorConfig
    )(app);

    return app;
  };
};
