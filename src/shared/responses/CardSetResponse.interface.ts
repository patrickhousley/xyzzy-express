import { CardSetAttributes } from 'src/shared/entities/CardSet.interface';

export enum CardSetGetErrorCode {
  ORM_SERVER_ERROR = 'ORM_SERVER_ERROR',
  DB_SERVER_ERROR = 'DB_SERVER_ERROR'
}

export interface CardSetGetResponse {
  // Successful response
  cardSets: CardSetAttributes[];

  // Failure response
  errorCode?: CardSetGetErrorCode;
  errorMessage?: string;
}
