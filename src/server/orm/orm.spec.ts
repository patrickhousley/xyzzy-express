import { interfaces } from 'inversify';
import { ConnectionOptions, Connection } from 'typeorm';
import { container } from 'src/server/orm/container';
import { registry } from 'src/server/orm/registry';
import {
  CardAttributes,
  BlackCardAttributes,
  CardSetAttributes
} from 'src/shared/entities';

describe('SERVER ORM: ORMBaseConnectionOptionsFactory', () => {
  let connection: Connection;

  beforeEach(async () => {
    container.snapshot();
    container
      .bind<ConnectionOptions>(registry.ORMConnectionOptions)
      .toConstantValue({
        autoSchemaSync: true,
        type: 'sqlite',
        database: ':memory:'
      });
    connection = (await container.get<interfaces.Provider<Connection>>(
      registry.ORMConnectionProvider
    )()) as Connection;
  });

  afterEach(async () => {
    await connection.close();
    container.unbind(registry.ORMConnectionOptions);
    container.unbind(registry.ORMConnection);
    await container.restore();
  });

  it('should be connected', () => {
    expect(connection).toBeDefined();
    expect(connection.isConnected).toBe(true);
  });

  it('should expose white card collection', async () => {
    expect(connection.getRepository('WhiteCard')).toBeDefined();

    const repo = connection.getRepository<CardAttributes>('WhiteCard');
    const wc = repo.create({
      text: 'test',
      watermark: 'test'
    });
    await repo.persist(wc);
  });

  it('should expose black card collection', async () => {
    expect(connection.getRepository('BlackCard')).toBeDefined();

    const repo = connection.getRepository<BlackCardAttributes>('BlackCard');
    const bc = repo.create({
      text: 'test',
      watermark: 'test'
    });
    await repo.persist(bc);
  });

  it('should expose cardset collection', async () => {
    expect(connection.getRepository('CardSet')).toBeDefined();

    const repo = connection.getRepository<CardSetAttributes>('CardSet');
    const cs = repo.create({
      name: 'test',
      description: 'test'
    });
    await repo.persist(cs);
  });

  it('should expose support a deck', async () => {
    const wcRepo = connection.getRepository<CardAttributes>('WhiteCard');
    const wc = wcRepo.create({
      text: 'test',
      watermark: 'test'
    });

    const bcRepo = connection.getRepository<BlackCardAttributes>('BlackCard');
    const bc = bcRepo.create({
      text: 'test',
      watermark: 'test'
    });

    const csRepo = connection.getRepository<CardSetAttributes>('CardSet');
    const cs = csRepo.create({
      name: 'test',
      description: 'test',
      blackCards: [bc],
      whiteCards: [wc]
    });
    await csRepo.persist(cs);
  });
});
