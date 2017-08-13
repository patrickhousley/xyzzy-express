/* tslint:disable:no-import-side-effect */
import 'src/server/polyfills';
/* tslint:enable:no-import-side-effect */

import * as express from 'express';
import * as winston from 'winston';
import { interfaces, Container } from 'inversify';
import { Connection, ConnectionOptions } from 'typeorm';
import { expressWebAppDevFactory } from 'src/server/express/factories/express-dev';
import { module as expressModule } from 'src/server/express/module';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/shared/services/Settings.interface';
import { module as sharedModule } from 'src/server/shared/module';
import { module as ormModule } from 'src/server/orm/module';

const container = new Container();
container.load(sharedModule, ormModule, expressModule);

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
container
  .bind<interfaces.Factory<express.Application>>(registry.ExpressApp)
  .toFactory(expressWebAppDevFactory);

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
