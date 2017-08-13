import { CardSetGetResponse } from 'src/shared/responses/CardSetResponse.interface';

export interface CardSetControllerAttributes {
  getCardSets(): Promise<CardSetGetResponse>;
}
