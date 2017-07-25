import * as winston from 'winston';
import { injectable } from 'inversify';
import { SettingsServiceAttributes } from 'src/server/services/Settings.interface';

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
  public auth0Domain: string;
  public auth0ClientId: string;
  public auth0ClientSecret: string;
  public awsRegion: string;
  public sqsSendMessageQueueUrl: string;
  public sqsSendMessageFailedQueueUrl: string;
  public maxSqsReceiveMessageCount: number;
  public emailSourceAddress: string;
  public emailReplyAddress: string;
  public verificationCodeTTL: number;
}
