import * as winston from 'winston';

export interface SettingsServiceAttributes {
  /**
   * Environment variable for specifying the execution environment. If not
   * defined, 'dev' will be used. Change this value by setting environment
   * variable NODE_ENV.
   * @type {string}
   */
  environment: string;
  isDevEnvironment: boolean;
  isProdEnvironment: boolean;
  isTestEnvironment: boolean;

  /**
   * Environment variable that can be used to enable logging while tests are running.
   */
  testLogging: boolean;

  /**
   * Environment variable for controlling the level of logging. Change this value
   * by setting environment variable LOG_LEVEL. If LOG_LEVEL is not set, the log
   * level will default to 'silly' if NODE_ENV is 'dev' or 'test' and 'info' if
   * NODE_ENV is 'prod' or not set.
   * @type {string}
   */
  loggerLevel: string;

  /**
   * Setting contianing the winston loggers for the current execution.
   * @type {winston.transports[]}
   */
  loggerTransports: winston.TransportInstance[];

  /**
   * URL to the database server. This is usually set when running
   * within Heroku.
   */
  databaseURL: string;

  /**
   * Setting containing the port to use for the express server.
   * @type {number}
   */
  port: string;
}
