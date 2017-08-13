import { DBError } from 'src/server/express/errors/DBError';
import { interfaces, inject, injectable } from 'inversify';
import { Get, JsonController } from 'routing-controllers';
import { CardSetControllerAttributes } from 'src/server/express/controllers/CardSet.interface';
import { registry } from 'src/server/registry';
import { CardSetAttributes } from 'src/shared/entities/CardSet.interface';
import { CardSetGetResponse } from 'src/shared/responses/CardSetResponse.interface';
import { Connection } from 'typeorm';
import * as winston from 'winston';

@JsonController('/cardSets')
@injectable()
export class CardSetController implements CardSetControllerAttributes {
  private static readonly loggerKey = 'CardSetController.class';
  private logger: winston.LoggerInstance;

  @inject(registry.ORMConnection) private ormConnection: Connection;

  constructor(
    @inject(registry.LoggerFactory)
    loggerFactory: interfaces.Factory<winston.LoggerInstance>
  ) {
    this.logger = loggerFactory() as winston.LoggerInstance;
  }

  @Get('/')
  public async getCardSets(): Promise<CardSetGetResponse> {
    try {
      const cardSetRepository = this.ormConnection.getRepository<CardSetAttributes>('CardSet');
      const cardSets = await cardSetRepository.find();
      return { cardSets };
    } catch (error) {
      this.logger.error(`${CardSetController.loggerKey}: ${error.message}`);
      throw new DBError();
    }
  }
}
