import { interfaces, Container } from 'inversify';
import { ConnectionOptions } from 'typeorm';
import { registry } from 'src/server/orm/registry';
import { baseConnectionOptionsFactory } from 'src/server/orm/db/base-options.factory';

describe('SERVER ORM: ORMBaseConnectionOptionsFactory', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container
      .bind<interfaces.Factory<ConnectionOptions>>(
        registry.ORMConnectionOptionsFactory
      )
      .toFactory<ConnectionOptions>(baseConnectionOptionsFactory)
      .whenTargetTagged('type', registry.ORMBaseConnectionOptionsFactory);
  });

  it('should contain options factory', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(
      registry.ORMConnectionOptionsFactory,
      'type',
      registry.ORMBaseConnectionOptionsFactory
    );
    expect(factory).toBeDefined();
    expect(typeof factory).toBe('function');
    expect(factory()).toBeDefined();
  });

  it('should set autoSchemaSync to false', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(
      registry.ORMConnectionOptionsFactory,
      'type',
      registry.ORMBaseConnectionOptionsFactory
    );
    const options: ConnectionOptions = factory() as ConnectionOptions;
    expect(options.autoSchemaSync).toBeDefined();
    expect(options.autoSchemaSync).toBeFalsy();
  });

  it('should override autoSchemaSync to true', () => {
    const factory = container.getTagged<interfaces.Factory<ConnectionOptions>>(
      registry.ORMConnectionOptionsFactory,
      'type',
      registry.ORMBaseConnectionOptionsFactory
    );
    const overrides: Partial<ConnectionOptions> = { autoSchemaSync: true };
    const options: ConnectionOptions = factory(overrides) as ConnectionOptions;
    expect(options.autoSchemaSync).toBeDefined();
    expect(options.autoSchemaSync).toBeTruthy();
  });
});
