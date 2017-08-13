import * as winston from 'winston';
import { interfaces } from 'inversify';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/shared/services/Settings.interface';

export const loggerFactory: interfaces.FactoryCreator<
  winston.LoggerInstance
> = (context: interfaces.Context) => () => {
  if (context.container.isBound(registry.Logger)) {
    return context.container.get<winston.LoggerInstance>(registry.Logger);
  }

  const settings = context.container.get<SettingsServiceAttributes>(
    registry.SettingsService
  );
  const logger = new winston.Logger({
    transports: settings.loggerTransports
  });

  context.container
    .bind<winston.LoggerInstance>(registry.Logger)
    .toConstantValue(logger);
  return logger;
};
