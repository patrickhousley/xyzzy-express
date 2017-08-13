import { ContainerModule, interfaces } from 'inversify';
import { baseConnectionOptionsFactory } from 'src/server/orm/db/base-options.factory';
import { connectionProvider } from 'src/server/orm/db/connection.provider';
import { sqliteConnectionOptionsFactory } from 'src/server/orm/db/sqlite-options.factory';
import { registry } from 'src/server/orm/registry';
import { Connection, ConnectionOptions } from 'typeorm';

export const module = new ContainerModule(bind => {
  /** ORM Connection Options Builders */
  bind<interfaces.Factory<ConnectionOptions>>(
    registry.ORMConnectionOptionsFactory
  )
    .toFactory<ConnectionOptions>(baseConnectionOptionsFactory)
    .whenTargetTagged('type', registry.ORMBaseConnectionOptionsFactory);

  bind<interfaces.Factory<ConnectionOptions>>(
    registry.ORMConnectionOptionsFactory
  )
    .toFactory<ConnectionOptions>(sqliteConnectionOptionsFactory)
    .whenTargetTagged('type', registry.ORMSQLiteConnectionOptionsFactory);

  /** ORM Connection Builder */
  bind<interfaces.Provider<Connection>>(registry.ORMConnectionProvider)
    .toProvider<Connection>(connectionProvider);
});
