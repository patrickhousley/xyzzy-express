/* tslint:disable:no-import-side-effect */
import 'src/server/polyfills';
/* tslint:enable:no-import-side-effect */

import * as express from 'express';
import * as winston from 'winston';
import { interfaces } from 'inversify';
import { Connection, ConnectionOptions } from 'typeorm';
import { container } from 'src/server/web-container';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/services/Settings.interface';

/** ORM DB Connection */
const connectionOptions: ConnectionOptions = container.getTagged<
  interfaces.Factory<ConnectionOptions>
>(
  registry.ORMConnectionOptionsFactory,
  'type',
  registry.ORMSQLiteConnectionOptionsFactory
)({
  autoSchemaSync: true
}) as ConnectionOptions;
container
  .bind<ConnectionOptions>(registry.ORMConnectionOptions)
  .toConstantValue(connectionOptions);
const connectionProvider: interfaces.Provider<Connection> = container.get<
  interfaces.Provider<Connection>
>(registry.ORMConnectionProvider);

/** Express Web App */
import { expressBaseWebConfigFactory } from 'src/server/express/base-web-config';
container
  .bind<interfaces.Factory<express.Application>>(registry.BaseExpressConfig)
  .toFactory(expressBaseWebConfigFactory);
import { expressBaseWebErrorConfigFactory } from 'src/server/express/base-web-error-config';
container
  .bind<interfaces.Factory<express.Application>>(
    registry.BaseExpressErrorConfig
  )
  .toFactory(expressBaseWebErrorConfigFactory);
import { expressWebAppTestFactory } from 'src/server/express/web-test';
container
  .bind<interfaces.Factory<express.Application>>(registry.ExpressApp)
  .toFactory(expressWebAppTestFactory);

export async function init(): Promise<express.Application> {
  await connectionProvider();

  const settings = container.get<SettingsServiceAttributes>(
    registry.SettingsService
  );
  const logger = container.get<interfaces.Factory<winston.LoggerInstance>>(
    registry.LoggerFactory
  )() as winston.LoggerInstance;
  const app = container.get<interfaces.Factory<express.Application>>(
    registry.ExpressApp
  )() as express.Application;
  app.listen(settings.port);
  logger.info('xyzzy2 server running', {
    environment: settings.environment,
    loggerLevel: settings.loggerLevel,
    startTime: new Date().toISOString(),
    port: settings.port
  });

  return app;
}
