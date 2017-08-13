import { CardSetAttributes } from 'src/shared/entities/CardSet.interface';

export enum CardSetGetErrorCode {
  DBError = 'DBError'
}

export interface CardSetGetResponse {
  // Successful response
  cardSets: CardSetAttributes[];

  // Failure response
  name?: CardSetGetErrorCode;
  message?: string;
}
