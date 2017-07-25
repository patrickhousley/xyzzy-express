import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import * as supertest from 'supertest';
import * as winston from 'winston';
import { Connection, ConnectionOptions } from 'typeorm';
import { interfaces, Container } from 'inversify';
import { TYPE } from 'inversify-express-utils';
import { CardSetController } from 'src/server/controllers/CardSet';
import { CardSetControllerAttributes } from 'src/server/controllers/CardSet.interface';
import { CardSetGetErrorCode } from 'src/shared/responses/CardSetResponse.interface';
import { container as ormContainer } from 'src/server/orm/container';
import { expressBaseWebConfigFactory } from 'src/server/express/base-web-config';
import { expressBaseWebErrorConfigFactory } from 'src/server/express/base-web-error-config';
import { expressWebAppTestFactory } from 'src/server/express/web-test';
import { MockSettingsService } from 'src/test-lib/mocks/server/services/Settings';
import { ormErrorHandler } from 'src/server/middleware/orm-error';
import { ORMErrorNameEnum } from 'src/server/shared/errors/ORMError.interface';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/services/Settings.interface';
import { sqliteErrorHandler } from 'src/server/middleware/sqlite-error';
import {
  SQLiteError,
  SQLiteServerErrorsEnum
} from 'src/server/shared/errors/SQLiteError.interface';

/* tslint:disable:no-require-imports no-var-requires typedef */
const expressWinston = require('express-winston');
/* tslint:enable:no-require-imports no-var-requires typedef */

describe('SERVER CONTROLLERS: CardSetController', () => {
  let container: Container;
  let mockSettingsService: SettingsServiceAttributes;
  let mockLogger: winston.LoggerInstance;
  let connection: Connection;
  let app: express.Application;

  beforeEach(async () => {
    container = new Container();

    // Services
    container
      .bind<SettingsServiceAttributes>(registry.SettingsService)
      .to(MockSettingsService)
      .inSingletonScope();
    mockSettingsService = container.get<SettingsServiceAttributes>(
      registry.SettingsService
    );
    mockSettingsService.loggerTransports = [
      new winston.transports.Console({
        silent: true
      })
    ];
    mockLogger = new winston.Logger();
    const loggerFactory: interfaces.FactoryCreator<winston.LoggerInstance> = (
      context: interfaces.Context
    ) => {
      return () => {
        return mockLogger;
      };
    };
    container
      .bind<interfaces.Factory<winston.LoggerInstance>>(registry.LoggerFactory)
      .toFactory(loggerFactory);

    // Middleware
    container
      .bind<interfaces.Factory<express.Application>>(registry.ExpressApp)
      .toFactory(expressWebAppTestFactory);
    container
      .bind<express.RequestHandler>(registry.ExpressBodyParserHandler)
      .toConstantValue(bodyParser.json());
    container
      .bind<express.RequestHandler>(registry.ExpressBodyParserEncoderHandler)
      .toConstantValue(bodyParser.urlencoded({ extended: true }));
    container
      .bind<express.RequestHandler>(registry.ExpressHelmetHandler)
      .toConstantValue(helmet());
    container
      .bind<express.RequestHandler>(registry.ExpressCompressionHandler)
      .toConstantValue(compression());
    container
      .bind<express.RequestHandler>(registry.ExpressLoggerHandler)
      .toConstantValue(
        expressWinston.logger({
          transports: mockSettingsService.loggerTransports
        })
      );
    container
      .bind<express.ErrorRequestHandler>(registry.ExpressDBErrorHandler)
      .toConstantValue(ormErrorHandler);
    container
      .bind<express.ErrorRequestHandler>(registry.ExpressSQLiteErrorHandler)
      .toConstantValue(sqliteErrorHandler);
    container
      .bind<express.ErrorRequestHandler>(registry.ExpressErrorLoggerHandler)
      .toConstantValue(
        expressWinston.errorLogger({
          transports: mockSettingsService.loggerTransports
        })
      );

    // ORM
    container.parent = ormContainer;
    container
      .bind<ConnectionOptions>(registry.ORMConnectionOptions)
      .toConstantValue({
        autoSchemaSync: true,
        type: 'sqlite',
        database: ':memory:'
      });
    connection = (await container.get<interfaces.Provider<Connection>>(
      registry.ORMConnectionProvider
    )()) as Connection;

    // Express configs
    container
      .bind<interfaces.Factory<express.Application>>(registry.BaseExpressConfig)
      .toFactory(expressBaseWebConfigFactory);
    container
      .bind<interfaces.Factory<express.Application>>(
        registry.BaseExpressErrorConfig
      )
      .toFactory(expressBaseWebErrorConfigFactory);
    container
      .bind<CardSetControllerAttributes>(TYPE.Controller)
      .to(CardSetController)
      .whenTargetNamed('CardSetController');
    app = container.get<interfaces.Factory<express.Application>>(
      registry.ExpressApp
    )() as express.Application;
  });

  afterEach(async () => {
    await connection.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('GET', () => {
    it('should respond successfully', async () => {
      /* tslint:disable:no-any */
      const cardSetRepositoryFind = jest
        .spyOn(connection.getRepository('CardSet'), 'find')
        .mockImplementation(async (entity: any): Promise<any> =>
          Promise.resolve([])
        );
      /* tslint:enable:no-any */
      await supertest(app).get('/api/cardSets').expect(200).then(response => {
        expect(response).toBeDefined();
        expect(response.body.cardSets).toBeDefined();
        expect(Array.isArray(response.body.cardSets)).toBe(true);
        expect(response.body.cardSets.length).toBe(0);
        expect(cardSetRepositoryFind).toHaveBeenCalledTimes(1);
      });
    });

    describe('ORM Integration', () => {
      it('should return ORM_SERVER_ERROR', async () => {
        const error = new Error(
          `${ORMErrorNameEnum.AlreadyHasActiveConnectionError}: Some orm error.`
        );
        error.name = ORMErrorNameEnum.AlreadyHasActiveConnectionError;
        /* tslint:disable:no-any */
        const cardSetRepositoryFind = jest
          .spyOn(connection.getRepository('CardSet'), 'find')
          .mockImplementation(async (entity: any): Promise<any> =>
            Promise.reject(error)
          );
        /* tslint:enable:no-any */
        await supertest(app).get('/api/cardSets').expect(503).then(response => {
          expect(response).toBeDefined();
          expect(response.body).toBeDefined();
          expect(response.body.errorCode).toBe(
            CardSetGetErrorCode.ORM_SERVER_ERROR
          );
          expect(response.body.errorMessage).toBe(
            'An internal server error occurred accessing the database.'
          );
          expect(cardSetRepositoryFind).toHaveBeenCalledTimes(1);
        });
      });

      it('should return DB_SERVER_ERROR', async () => {
        const error = new Error(
          `${SQLiteServerErrorsEnum.SQLITE_CANTOPEN}: Some db error.`
        );
        (error as SQLiteError).code = SQLiteServerErrorsEnum.SQLITE_CANTOPEN;
        /* tslint:disable:no-any */
        const cardSetRepositoryFind = jest
          .spyOn(connection.getRepository('CardSet'), 'find')
          .mockImplementation(async (entity: any): Promise<any> =>
            Promise.reject(error)
          );
        /* tslint:enable:no-any */
        await supertest(app).get('/api/cardSets').expect(503).then(response => {
          expect(response).toBeDefined();
          expect(response.body).toBeDefined();
          expect(response.body.errorCode).toBe(
            CardSetGetErrorCode.DB_SERVER_ERROR
          );
          expect(response.body.errorMessage).toBe(
            'An internal server error occurred accessing the database.'
          );
          expect(cardSetRepositoryFind).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
