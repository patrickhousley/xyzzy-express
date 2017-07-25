import * as process from 'process';
import * as winston from 'winston';
import { injectable } from 'inversify';
import { SettingsServiceAttributes } from 'src/server/services/Settings.interface';

@injectable()
export class SettingsService implements SettingsServiceAttributes {
  public environment = process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV !== 'undefined'
    ? process.env.NODE_ENV
    : 'development';
  public isDevEnvironment = this.environment === 'development';
  public isProdEnvironment = this.environment === 'production';
  public isTestEnvironment = this.environment === 'test';
  public testLogging = process.env.TEST_LOGGING === 'true';
  public loggerLevel = process.env.LOG_LEVEL && process.env.LOG_LEVEL.length > 0
    ? process.env.LOG_LEVEL
    : this.isDevEnvironment || this.isTestEnvironment ? 'silly' : 'info';
  public loggerTransports = [
    new winston.transports.Console({
      level: this.loggerLevel,
      colorize: false,
      silent: !(
        this.isProdEnvironment ||
        this.isDevEnvironment ||
        this.testLogging
      )
    })
  ];
  public databaseURL = process.env.DATABASE_URL;
  public port = process.env.PORT !== undefined &&
  process.env.PORT !== 'undefined'
    ? process.env.PORT
    : '3000';
}
