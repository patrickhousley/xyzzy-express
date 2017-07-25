import { CardAttributes } from 'src/shared/entities/Card.interface';

export interface BlackCardAttributes extends CardAttributes {
  draw: number;
  pick: number;
}
