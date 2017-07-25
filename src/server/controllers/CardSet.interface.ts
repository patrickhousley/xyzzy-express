import { interfaces } from 'inversify-express-utils';
import { CardSetGetResponse } from 'src/shared/responses/CardSetResponse.interface';

export interface CardSetControllerAttributes extends interfaces.Controller {
  getCardSets(): Promise<CardSetGetResponse | null>;
}
