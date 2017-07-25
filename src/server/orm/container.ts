import { Container, interfaces } from 'inversify';
import { ConnectionOptions, Connection } from 'typeorm';
import { registry } from 'src/server/orm/registry';

const container = new Container();

/** ORM Connection Options Builders */
import { baseConnectionOptionsFactory } from 'src/server/orm/db/base-options.factory';
container
  .bind<interfaces.Factory<ConnectionOptions>>(
    registry.ORMConnectionOptionsFactory
  )
  .toFactory<ConnectionOptions>(baseConnectionOptionsFactory)
  .whenTargetTagged('type', registry.ORMBaseConnectionOptionsFactory);

import { sqliteConnectionOptionsFactory } from 'src/server/orm/db/sqlite-options.factory';
container
  .bind<interfaces.Factory<ConnectionOptions>>(
    registry.ORMConnectionOptionsFactory
  )
  .toFactory<ConnectionOptions>(sqliteConnectionOptionsFactory)
  .whenTargetTagged('type', registry.ORMSQLiteConnectionOptionsFactory);

/** ORM Connection Builder */
import { conectionProvider } from 'src/server/orm/db/connection.provider';
container
  .bind<interfaces.Provider<Connection>>(registry.ORMConnectionProvider)
  .toProvider<Connection>(conectionProvider);

export { container };
