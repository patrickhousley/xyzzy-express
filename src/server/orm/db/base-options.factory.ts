import { interfaces } from 'inversify';
import { ConnectionOptions } from 'typeorm';

export const baseConnectionOptionsFactory: interfaces.FactoryCreator<
  ConnectionOptions
> = (_context: interfaces.Context) => {
  return (overrides?: Partial<ConnectionOptions>) => {
    if (!overrides) {
      overrides = Object.create(null);
    }

    const baseSettings: Partial<ConnectionOptions> = {
      autoSchemaSync: false
    };

    return {
      ...baseSettings,
      ...overrides
    } as ConnectionOptions;
  };
};
