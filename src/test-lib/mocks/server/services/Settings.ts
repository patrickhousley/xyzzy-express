import * as winston from 'winston';
import { injectable } from 'inversify';
import { SettingsServiceAttributes } from 'src/server/shared/services/Settings.interface';

@injectable()
export class MockSettingsService implements SettingsServiceAttributes {
  public environment: string;
  public isDevEnvironment: boolean;
  public isProdEnvironment: boolean;
  public isTestEnvironment: boolean;
  public testLogging: boolean;
  public loggerLevel: string;
  public loggerTransports: winston.TransportInstance[];
  public databaseURL: string;
  public port: string;
}
