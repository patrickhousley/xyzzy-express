import * as winston from 'winston';
import { interfaces } from 'inversify';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/services/Settings.interface';

export const loggerFactory: interfaces.FactoryCreator<
  winston.LoggerInstance
> = (context: interfaces.Context) => {
  return () => {
    const settings = context.container.get<SettingsServiceAttributes>(
      registry.SettingsService
    );
    return new winston.Logger({
      transports: settings.loggerTransports
    });
  };
};
