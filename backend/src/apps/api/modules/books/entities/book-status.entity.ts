import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { EReadingStatus } from '../types/reading-status';
import { BookEntity } from './book.entity';

@Entity('book_statuses')
@Unique(['book_id', 'user_id'])
export class BookStatusEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EReadingStatus })
  status: EReadingStatus;

  @OneToMany(() => BookEntity, (book) => book.id)
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;

  @Column()
  book_id: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  user_id: string;
}
