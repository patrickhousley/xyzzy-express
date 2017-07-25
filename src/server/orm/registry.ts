import { Registry } from 'src/server/shared/ioc/Registry.interface';

export const registry: Registry = {
  ORMConnectionOptions: Symbol('ORMConnectionOptions'),
  ORMConnection: Symbol('ORMConnection'),
  ORMConnectionOptionsFactory: Symbol('ORMConnectionOptionsFactory'),
  ORMEntity: Symbol('ORMEntity'),

  // Single inject symbols
  ORMConnectionProvider: Symbol('ORMConnectionProvider'),

  // ORM ConnectionOptions Types
  ORMBaseConnectionOptionsFactory: Symbol('ORMBaseConnectionOptionsFactory'),
  ORMSQLiteConnectionOptionsFactory: Symbol('ORMSQLiteConnectionOptionsFactory')
};
