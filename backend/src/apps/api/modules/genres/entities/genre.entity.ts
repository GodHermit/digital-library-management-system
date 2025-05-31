import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, ManyToMany, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BookEntity } from '../../books/entities/book.entity';
import { EGenreStatus } from '../types';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('genres')
export class GenreEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => BookEntity, (book) => book.genres)
  books: BookEntity[];

  @Column({
    type: 'enum',
    enum: EGenreStatus,
    default: EGenreStatus.PENDING,
  })
  status: EGenreStatus;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;
}
