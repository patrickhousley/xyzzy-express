export const registry = {
  ORMConnectionOptions: Symbol('ORMConnectionOptions'),
  ORMConnection: Symbol('ORMConnection'),
  ORMConnectionOptionsFactory: Symbol('ORMConnectionOptionsFactory'),

  // Single inject symbols
  ORMConnectionProvider: Symbol('ORMConnectionProvider'),

  // ORM ConnectionOptions Types
  ORMBaseConnectionOptionsFactory: Symbol('ORMBaseConnectionOptionsFactory'),
  ORMSQLiteConnectionOptionsFactory: Symbol('ORMSQLiteConnectionOptionsFactory')
};
