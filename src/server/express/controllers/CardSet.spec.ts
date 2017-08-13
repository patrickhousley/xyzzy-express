import * as express from 'express';
import { Container, interfaces } from 'inversify';
import { useContainer, useExpressServer } from 'routing-controllers';
import { CardSetController } from 'src/server/express/controllers/CardSet';
import { CardSetControllerAttributes } from 'src/server/express/controllers/CardSet.interface';
import { module as ormModule } from 'src/server/orm/module';
import { registry } from 'src/server/registry';
import { SettingsServiceAttributes } from 'src/server/shared/services/Settings.interface';
import { ORMErrorNameEnum } from 'src/server/shared/errors/ORMError.interface';
import { SQLiteError, SQLiteServerErrorsEnum } from 'src/server/shared/errors/SQLiteError.interface';
import { CardSetGetErrorCode } from 'src/shared/responses/CardSetResponse.interface';
import { MockSettingsService } from 'src/test-lib/mocks/server/services/Settings';
import * as supertest from 'supertest';
import { Connection, ConnectionOptions } from 'typeorm';
import * as winston from 'winston';

describe('SERVER CONTROLLERS: CardSetController', () => {
  let container: Container;
  let mockSettingsService: SettingsServiceAttributes;
  let mockLogger: winston.LoggerInstance;
  let connection: Connection;
  let app: express.Application;

  beforeEach(async () => {
    container = new Container();
    container.load(ormModule);

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

    // ORM
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
      .bind<CardSetControllerAttributes>(CardSetController)
      .toSelf();
    app = express();
    useContainer(container);
    useExpressServer(app, {
      routePrefix: '/api',
      controllers: [CardSetController],
      development: true
    });
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
      it('should return DBError', async () => {
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
        await supertest(app).get('/api/cardSets').expect(500).then(response => {
          expect(response).toBeDefined();
          expect(response.body).toBeDefined();
          expect(response.body.name).toBe(
            CardSetGetErrorCode.DBError
          );
          expect(response.body.message).toBe(
            'An internal server error occurred accessing the database.'
          );
          expect(cardSetRepositoryFind).toHaveBeenCalledTimes(1);
        });
      });

      it('should return DBError', async () => {
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
        await supertest(app).get('/api/cardSets').expect(500).then(response => {
          expect(response).toBeDefined();
          expect(response.body).toBeDefined();
          expect(response.body.name).toBe(
            CardSetGetErrorCode.DBError
          );
          expect(response.body.message).toBe(
            'An internal server error occurred accessing the database.'
          );
          expect(cardSetRepositoryFind).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
