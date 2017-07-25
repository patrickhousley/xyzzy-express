import * as winston from 'winston';
import { interfaces, Container } from 'inversify';
import { loggerFactory } from 'src/server/factories/logger';
import { MockSettingsService } from 'src/test-lib/mocks/server/services/Settings';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/services/Settings.interface';

describe('SERVER FACTORIES: LoggerFactory', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container
      .bind<SettingsServiceAttributes>(registry.SettingsService)
      .to(MockSettingsService)
      .inSingletonScope();
    container
      .bind<interfaces.Factory<winston.LoggerInstance>>(registry.LoggerFactory)
      .toFactory(loggerFactory);
  });

  it('should contain logger factory', () => {
    const factory = container.get<interfaces.Factory<winston.LoggerInstance>>(
      registry.LoggerFactory
    );
    expect(factory).toBeDefined();
    expect(typeof factory).toBe('function');
    expect(factory()).toBeDefined();
  });

  it('should return a winston logger instance', () => {
    const factory = container.get<interfaces.Factory<winston.LoggerInstance>>(
      registry.LoggerFactory
    );
    const logger: winston.LoggerInstance = factory() as winston.LoggerInstance;
    expect(logger).toBeDefined();
    expect(logger.log).toBeDefined();
  });
});
