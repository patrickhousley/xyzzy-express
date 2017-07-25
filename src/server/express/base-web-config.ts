import * as express from 'express';
import { interfaces } from 'inversify';
import { registry } from 'src/server/registry';

export const expressBaseWebConfigFactory: interfaces.FactoryCreator<
  express.Application
> = (context: interfaces.Context) => {
  return (app: express.Application) => {
    app.use(context.container.get(registry.ExpressBodyParserHandler));
    app.use(context.container.get(registry.ExpressBodyParserEncoderHandler));
    app.use(context.container.get(registry.ExpressHelmetHandler));
    app.use(context.container.get(registry.ExpressCompressionHandler));
    app.use(context.container.get(registry.ExpressLoggerHandler));

    return app;
  };
};
