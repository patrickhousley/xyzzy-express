import { Container, interfaces } from 'inversify';
import { baseConnectionOptionsFactory } from 'src/server/orm/db/base-options.factory';
import { registry } from 'src/server/orm/registry';
import { ConnectionOptions } from 'typeorm';

describe('SERVER ORM: ORMBaseConnectionOptionsFactory', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container
      .bind<interfaces.Factory<ConnectionOptions>>(registry.ORMConnectionOptionsFactory)
      .toFactory<ConnectionOptions>(baseConnectionOptionsFactory)
      .whenTargetTagged('type', registry.ORMBaseConnectionOptionsFactory);
  });

  it('should contain options factory', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(registry.ORMConnectionOptionsFactory, 'type', registry.ORMBaseConnectionOptionsFactory);
    expect(factory).toBeDefined();
    expect(typeof factory).toBe('function');
    expect(factory()).toBeDefined();
  });

  it('should set synchronize to false', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(registry.ORMConnectionOptionsFactory, 'type', registry.ORMBaseConnectionOptionsFactory);
    const options: ConnectionOptions = factory() as ConnectionOptions;
    expect(options.synchronize).toBeDefined();
    expect(options.synchronize).toBeFalsy();
  });

  it('should override synchronize to true', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(registry.ORMConnectionOptionsFactory, 'type', registry.ORMBaseConnectionOptionsFactory);
    const overrides: Partial<ConnectionOptions> = { synchronize: true };
    const options: ConnectionOptions = factory(overrides) as ConnectionOptions;
    expect(options.synchronize).toBeDefined();
    expect(options.synchronize).toBeTruthy();
  });
});
