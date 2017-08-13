import { ContainerModule, interfaces } from 'inversify';
import { registry } from 'src/server/registry';
import { loggerFactory } from 'src/server/shared/factories/logger';
import { SettingsService } from 'src/server/shared/services/Settings';
import { SettingsServiceAttributes } from 'src/server/shared/services/Settings.interface';
import * as winston from 'winston';

export const module = new ContainerModule(bind => {
  /** Services */
  bind<SettingsServiceAttributes>(registry.SettingsService).to(SettingsService);

  /** Factories */

  bind<interfaces.Factory<winston.LoggerInstance>>(
    registry.LoggerFactory
  ).toFactory(loggerFactory);
});
