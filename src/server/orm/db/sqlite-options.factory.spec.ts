import { interfaces, Container } from 'inversify';
import { ConnectionOptions } from 'typeorm';
import { registry } from 'src/server/orm/registry';
import { sqliteConnectionOptionsFactory } from 'src/server/orm/db/sqlite-options.factory';

describe('SERVER ORM: ORMSQLiteConnectionOptionsBuilder', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    const baseConnectionOptionsFactory: interfaces.FactoryCreator<
      ConnectionOptions
    > = (_context: interfaces.Context) => {
      return () => {
        return {} as ConnectionOptions;
      };
    };
    container
      .bind<interfaces.Factory<ConnectionOptions>>(
        registry.ORMConnectionOptionsFactory
      )
      .toFactory<ConnectionOptions>(baseConnectionOptionsFactory)
      .whenTargetTagged('type', registry.ORMBaseConnectionOptionsFactory);
    container
      .bind<interfaces.Factory<ConnectionOptions>>(
        registry.ORMConnectionOptionsFactory
      )
      .toFactory<ConnectionOptions>(sqliteConnectionOptionsFactory)
      .whenTargetTagged('type', registry.ORMSQLiteConnectionOptionsFactory);
  });

  it('should contain options factory', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(
      registry.ORMConnectionOptionsFactory,
      'type',
      registry.ORMSQLiteConnectionOptionsFactory
    );
    expect(factory).toBeDefined();
    expect(typeof factory).toBe('function');
  });

  it('should set type to sqlite', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(
      registry.ORMConnectionOptionsFactory,
      'type',
      registry.ORMSQLiteConnectionOptionsFactory
    );
    const options: ConnectionOptions = factory() as ConnectionOptions;
    expect(options.type).toBe('sqlite');
  });

  it('should set database to :memory:', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(
      registry.ORMConnectionOptionsFactory,
      'type',
      registry.ORMSQLiteConnectionOptionsFactory
    );
    const options: ConnectionOptions = factory() as ConnectionOptions;
    expect(options.database).toBe(':memory:');
  });

  it('should override type to mssql', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(
      registry.ORMConnectionOptionsFactory,
      'type',
      registry.ORMSQLiteConnectionOptionsFactory
    );
    const overrides: Partial<ConnectionOptions> = { type: 'mssql' };
    const options: ConnectionOptions = factory(overrides) as ConnectionOptions;
    expect(options.type).toBe('mssql');
  });
});
