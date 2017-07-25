import * as express from 'express';
import { interfaces } from 'inversify';
import { registry } from 'src/server/registry';

export const expressBaseWebErrorConfigFactory: interfaces.FactoryCreator<
  express.Application
> = (context: interfaces.Context) => {
  return (app: express.Application) => {
    app.use(context.container.get(registry.ExpressErrorLoggerHandler));
    app.use(context.container.get(registry.ExpressDBErrorHandler));
    app.use(context.container.get(registry.ExpressSQLiteErrorHandler));

    return app;
  };
};
