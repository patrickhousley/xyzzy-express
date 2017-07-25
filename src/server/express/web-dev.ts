import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackMiddleware from 'webpack-dev-middleware';
import { interfaces } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { registry } from 'src/server/registry';

/* tslint:disable:no-require-imports no-var-requires typedef */
const webpackDevConfig = require('src/../config/webpack/webpack.dev');
const historyApiFallback = require('connect-history-api-fallback');
/* tslint:enable:no-require-imports no-var-requires typedef */

export const expressWebAppDevFactory: interfaces.FactoryCreator<
  express.Application
> = (context: interfaces.Context) => {
  return () => {
    const app = express();
    const server = new InversifyExpressServer(context.container);
    context.container.get<interfaces.Factory<express.Application>>(
      registry.BaseExpressConfig
    )(app);
    app.use('/api', server.build());
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
      registry.BaseExpressErrorConfig
    )(app);

    return app;
  };
};
