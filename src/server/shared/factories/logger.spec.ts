/* tslint:disable:no-unbound-method */
import * as winston from 'winston';
import { interfaces, Container } from 'inversify';
import { loggerFactory } from 'src/server/shared/factories/logger';
import { MockSettingsService } from 'src/test-lib/mocks/server/services/Settings';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/shared/services/Settings.interface';

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
    expect(logger.profile).toBeDefined();
    expect(logger.log).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.silly).toBeDefined();
    expect(logger.info).toBeDefined();
  });

  it('should return the same logger when called multiple times', () => {
    const factory = container.get<interfaces.Factory<winston.LoggerInstance>>(
      registry.LoggerFactory
    );
    const logger: winston.LoggerInstance = factory() as winston.LoggerInstance;
    expect(logger).toBeDefined();

    const secondLogger: winston.LoggerInstance = factory() as winston.LoggerInstance;
    expect(secondLogger).toBeDefined();
    expect(secondLogger).toBe(logger);
  });
});
