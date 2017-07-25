import { Registry } from 'src/server/shared/ioc/Registry.interface';
import { registry as ormRegistry } from 'src/server/orm/registry';

export const registry: Registry = {
  ...ormRegistry,
  // Middleware
  ExpressBodyParserHandler: Symbol('ExpressBodyParserHandler'),
  ExpressBodyParserEncoderHandler: Symbol('ExpressBodyParserEncoderHandler'),
  ExpressHelmetHandler: Symbol('ExpressHelmetHandler'),
  ExpressCompressionHandler: Symbol('ExpressCompressionHandler'),
  ExpressLoggerHandler: Symbol('ExpressLoggerHandler'),

  ExpressErrorLoggerHandler: Symbol('ExpressErrorLoggerHandler'),
  ExpressDBErrorHandler: Symbol('ExpressDBErrorHandler'),
  ExpressSQLiteErrorHandler: Symbol('ExpressSQLiteErrorHandler'),

  // Express Apps
  ExpressApp: Symbol('ExpressApp'),
  BaseExpressConfig: Symbol('BaseExpressConfig'),
  BaseExpressErrorConfig: Symbol('BaseExpressErrorConfig'),

  // Services
  SettingsService: Symbol('SettingsService'),

  // Factories
  LoggerFactory: Symbol('LoggerFactory')
};
