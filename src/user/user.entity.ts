import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Deck } from 'src/decks/deck.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Deck, (deck) => deck.user)
  decks: Deck[];
}
