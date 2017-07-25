import { interfaces, injectable, Container } from 'inversify';
import { ConnectionOptions, Connection } from 'typeorm';
import { conectionProvider } from 'src/server/orm/db/connection.provider';
import { registry } from 'src/server/orm/registry';

@injectable()
class MockEntity {}

describe('SERVER ORM: ORMConnectionProvider', () => {
  let container: Container;
  let connection: Connection;

  beforeEach(async () => {
    container = new Container();
    container
      .bind<ConnectionOptions>(registry.ORMConnectionOptions)
      .toConstantValue({
        autoSchemaSync: true,
        type: 'sqlite',
        database: ':memory:'
      });
    container
      .bind<interfaces.Newable<MockEntity>>(registry.ORMEntity)
      .toConstructor(MockEntity);
    container
      .bind<interfaces.Provider<Connection>>(registry.ORMConnectionProvider)
      .toProvider<Connection>(conectionProvider);
    connection = (await container.get<interfaces.Provider<Connection>>(
      registry.ORMConnectionProvider
    )()) as Connection;
  });

  afterEach(async () => {
    await connection.close();
    container.unbind(registry.ORMConnectionOptions);
    container.unbind(registry.ORMConnection);
  });

  it('should be connected to database', () => {
    expect(connection).toBeDefined();
    expect(connection.isConnected).toBeTruthy();
  });

  it('should return the same connection when one already exists', async () => {
    const newConnection = (await container.get<interfaces.Provider<Connection>>(
      registry.ORMConnectionProvider
    )()) as Connection;
    expect(connection).toBe(newConnection);
  });
});
