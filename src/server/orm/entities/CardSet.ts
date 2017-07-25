import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {
  BlackCardAttributes,
  CardAttributes,
  CardSetAttributes
} from 'src/shared/entities';
import { BlackCard } from 'src/server/orm/entities/BlackCard';
import { WhiteCard } from 'src/server/orm/entities/WhiteCard';

@Entity()
export class CardSet implements CardSetAttributes {
  @PrimaryGeneratedColumn() public id: number;

  @Column({
    type: 'boolean',
    default: false
  })
  public active: boolean;

  @Column({
    type: 'varchar',
    length: 255
  })
  public name: string;

  @Column({
    type: 'boolean',
    default: false
  })
  public baseDeck: boolean;

  @Column({
    type: 'varchar',
    length: 255
  })
  public description: string;

  @Column({
    type: 'int',
    default: 0
  })
  public weight: number;

  @OneToMany(() => BlackCard, blackCard => blackCard.cardSet, {
    cascadeInsert: true,
    cascadeUpdate: true
  })
  public blackCards: BlackCardAttributes[];

  @OneToMany(() => WhiteCard, whiteCard => whiteCard.cardSet, {
    cascadeInsert: true,
    cascadeUpdate: true
  })
  public whiteCards: CardAttributes[];
}
