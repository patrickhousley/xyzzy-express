import * as express from 'express';
import { interfaces } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { registry } from 'src/server/registry';

export const expressWebAppTestFactory: interfaces.FactoryCreator<
  express.Application
> = (context: interfaces.Context) => {
  return () => {
    const app = express();
    const server = new InversifyExpressServer(context.container);
    context.container.get<interfaces.Factory<express.Application>>(
      registry.BaseExpressConfig
    )(app);
    app.use('/api', server.build());
    context.container.get<interfaces.Factory<express.Application>>(
      registry.BaseExpressErrorConfig
    )(app);

    return app;
  };
};
