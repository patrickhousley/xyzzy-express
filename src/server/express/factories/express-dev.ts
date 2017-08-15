import * as express from 'express';
import { interfaces } from 'inversify';
import { useContainer, useExpressServer } from 'routing-controllers';
import { CardSetController } from 'src/server/express/controllers/CardSet';
import { registry } from 'src/server/registry';
import * as webpack from 'webpack';
import * as webpackMiddleware from 'webpack-dev-middleware';

/* tslint:disable:no-require-imports no-var-requires typedef */
const webpackDevConfig = require('src/../config/webpack/webpack.client');
const historyApiFallback = require('connect-history-api-fallback');
/* tslint:enable:no-require-imports no-var-requires typedef */

export const expressWebAppDevFactory: interfaces.FactoryCreator<
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
    development: true,
    validation: { validationError: { target: false, value: false } }
  });
  app.use(historyApiFallback());
  app.use(
    webpackMiddleware(webpack(webpackDevConfig), {
      publicPath: '/',
      index: 'index.html',
      stats: {
        colors: true
      }
    })
  );
  context.container.get<interfaces.Factory<express.Application>>(
    registry.ExpressErrorConfig
  )(app);

  return app;
};
