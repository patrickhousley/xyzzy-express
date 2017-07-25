import { controller, httpGet } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Connection } from 'typeorm';
import { CardSetGetResponse } from 'src/shared/responses/CardSetResponse.interface';
import { registry } from 'src/server/registry';
import { CardSetAttributes } from 'src/shared/entities/CardSet.interface';
import { CardSetControllerAttributes } from 'src/server/controllers/CardSet.interface';

@controller('/cardSets')
@injectable()
export class CardSetController implements CardSetControllerAttributes {
  @inject(registry.ORMConnection) private ormConnection: Connection;

  @httpGet('/')
  public async getCardSets(): Promise<CardSetGetResponse | null> {
    const cardSetRepository = this.ormConnection.getRepository<
      CardSetAttributes
    >('CardSet');
    const cardSets = await cardSetRepository.find();
    return { cardSets };
  }
}
