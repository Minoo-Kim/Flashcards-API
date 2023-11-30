import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Deck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 0 })
  numCards: number;

  @ManyToOne(() => User, (user) => user.decks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
