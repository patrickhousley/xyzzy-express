import * as process from 'process';
import * as winston from 'winston';
import { Container } from 'inversify';
import { registry } from 'src/server/registry';
import { SettingsService } from 'src/server/services/Settings';
import { SettingsServiceAttributes } from 'src/server/services/Settings.interface';

describe('SERVER SERVICES: SettingsService', () => {
  let container: Container;

  beforeEach(() => {
    delete process.env.NODE_ENV;
    delete process.env.TEST_LOGGING;
    delete process.env.LOG_LEVEL;
    delete process.env.DATABASE_URL;
    delete process.env.PORT;
    delete process.env.AUTH0_DOMAIN;
    delete process.env.AUTH0_CLIENT_ID;
    delete process.env.AUTH0_CLIENT_SECRET;
    delete process.env.AWS_REGION;
    delete process.env.SQS_SEND_MESSAGE_QUEUE_URL;
    delete process.env.SQS_SEND_MESSAGE_FAILED_QUEUE_URL;

    container = new Container();
    container
      .bind<SettingsServiceAttributes>(registry.SettingsService)
      .to(SettingsService);
  });

  it('should be defined', () => {
    const service = container.get<SettingsServiceAttributes>(
      registry.SettingsService
    );
    expect(service).toBeDefined();
  });

  [
    {
      test: undefined,
      expected: 'development',
      expectedIsDev: true,
      expectedIsProd: false,
      expectedIsTest: false
    },
    {
      test: 'undefined',
      expected: 'development',
      expectedIsDev: true,
      expectedIsProd: false,
      expectedIsTest: false
    },
    {
      test: 'development',
      expected: 'development',
      expectedIsDev: true,
      expectedIsProd: false,
      expectedIsTest: false
    },
    {
      test: 'production',
      expected: 'production',
      expectedIsDev: false,
      expectedIsProd: true,
      expectedIsTest: false
    },
    {
      test: 'test',
      expected: 'test',
      expectedIsDev: false,
      expectedIsProd: false,
      expectedIsTest: true
    }
  ].forEach(
    ({ test, expected, expectedIsDev, expectedIsProd, expectedIsTest }) =>
      it(`should set the environment property properly: ${test}`, () => {
        process.env.NODE_ENV = test;
        const service = container.get<SettingsServiceAttributes>(
          registry.SettingsService
        );
        expect(service.environment).toBe(expected);
        expect(service.isDevEnvironment).toBe(expectedIsDev);
        expect(service.isProdEnvironment).toBe(expectedIsProd);
        expect(service.isTestEnvironment).toBe(expectedIsTest);
      })
  );

  [
    { test: undefined, expected: false },
    { test: 'false', expected: false },
    { test: 'true', expected: true }
  ].forEach(({ test, expected }) =>
    it(`should set the testLogging property properly: ${test}`, () => {
      process.env.TEST_LOGGING = test;
      const service = container.get<SettingsServiceAttributes>(
        registry.SettingsService
      );
      expect(service.testLogging).toBe(expected);
    })
  );

  it('should set the loggerLevel property using LOG_LEVEL environment variable properly', () => {
    process.env.LOG_LEVEL = 'test';
    const service = container.get<SettingsServiceAttributes>(
      registry.SettingsService
    );
    expect(service.loggerLevel).toBe('test');
  });

  [
    { test: 'development', expected: 'silly' },
    { test: 'production', expected: 'info' },
    { test: 'test', expected: 'silly' }
  ].forEach(({ test, expected }) =>
    it(`should set the loggerLevel property using NODE_ENV environment variable properly: ${test}`, () => {
      process.env.NODE_ENV = test;
      const service = container.get<SettingsServiceAttributes>(
        registry.SettingsService
      );
      expect(service.loggerLevel).toBe(expected);
    })
  );

  [
    {
      testLevel: 'testA',
      testEnv: 'development',
      testLogging: 'false',
      expectedLevel: 'testA',
      expectedColorize: false,
      expectedSilent: false
    },
    {
      testLevel: 'testB',
      testEnv: 'development',
      testLogging: 'true',
      expectedLevel: 'testB',
      expectedColorize: false,
      expectedSilent: false
    },
    {
      testLevel: 'testC',
      testEnv: 'production',
      testLogging: 'false',
      expectedLevel: 'testC',
      expectedColorize: false,
      expectedSilent: false
    },
    {
      testLevel: 'testD',
      testEnv: 'production',
      testLogging: 'true',
      expectedLevel: 'testD',
      expectedColorize: false,
      expectedSilent: false
    },
    {
      testLevel: 'testE',
      testEnv: 'test',
      testLogging: 'false',
      expectedLevel: 'testE',
      expectedColorize: false,
      expectedSilent: true
    },
    {
      testLevel: 'testF',
      testEnv: 'test',
      testLogging: 'true',
      expectedLevel: 'testF',
      expectedColorize: false,
      expectedSilent: false
    }
  ].forEach(
    ({
      testLevel,
      testEnv,
      testLogging,
      expectedLevel,
      expectedColorize,
      expectedSilent
    }) =>
      it(`should create the winston logger properly: ${testLevel}:${testEnv}:${testLogging}`, () => {
        process.env.LOG_LEVEL = testLevel;
        process.env.NODE_ENV = testEnv;
        process.env.TEST_LOGGING = testLogging;
        const service = container.get<SettingsServiceAttributes>(
          registry.SettingsService
        );
        const winstonLogger = service
          .loggerTransports[0] as winston.ConsoleTransportInstance;
        expect(winstonLogger.level).toBe(expectedLevel);
        expect(winstonLogger.colorize).toBe(expectedColorize);
        expect(winstonLogger.silent).toBe(expectedSilent);
      })
  );

  it('should set the databaseURL property properly', () => {
    process.env.DATABASE_URL = 'test';
    const service = container.get<SettingsServiceAttributes>(
      registry.SettingsService
    );
    expect(service.databaseURL).toBe('test');
  });

  [
    { test: undefined, expected: '3000' },
    { test: 'undefined', expected: '3000' },
    { test: '2000', expected: '2000' }
  ].forEach(({ test, expected }) =>
    it(`should set the port property properly: ${test}`, () => {
      process.env.PORT = test;
      const service = container.get<SettingsServiceAttributes>(
        registry.SettingsService
      );
      expect(service.port).toBe(expected);
    })
  );
});
