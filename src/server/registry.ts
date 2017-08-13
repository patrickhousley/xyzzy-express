import { registry as expressRegistry } from 'src/server/express/registry';
import { registry as ormRegistry } from 'src/server/orm/registry';
import { registry as sharedRegistry } from 'src/server/shared/registry';

export const registry = {
  ...ormRegistry,
  ...expressRegistry,
  ...sharedRegistry
};
