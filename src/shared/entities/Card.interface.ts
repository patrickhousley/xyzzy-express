import { CardSetAttributes } from 'src/shared/entities/CardSet.interface';

export interface CardAttributes {
  id: number;
  text: string;
  watermark: string;
  cardSet: CardSetAttributes;
}
