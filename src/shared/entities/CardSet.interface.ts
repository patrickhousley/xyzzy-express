import { BlackCardAttributes, CardAttributes } from 'src/shared/entities';

export interface CardSetAttributes {
  id: number;
  active: boolean;
  name: string;
  baseDeck: boolean;
  description: string;
  weight: number;
  blackCards: BlackCardAttributes[];
  whiteCards: CardAttributes[];
}
