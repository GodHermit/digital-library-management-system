import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { GenreEntity } from '../../genres/entities/genre.entity';
import { PublisherEntity } from '../../publishers/entities/publisher.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('books')
export class BookEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamptz' })
  publishedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'publishedByUserId' })
  publishedBy?: UserEntity;

  @Column()
  publishedByUserId: string;

  @ManyToMany(() => UserEntity, (user) => user.publishedBooks, { eager: true })
  @JoinTable({
    name: 'book_authors',
    joinColumn: {
      name: 'bookId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'authorId',
      referencedColumnName: 'id',
    },
  })
  authors?: UserEntity[];

  @Column()
  language: string;

  @Column()
  coverUrl?: string;

  @Column({ type: 'double precision' })
  priceInETH: number;

  @ManyToOne(() => PublisherEntity, (publisher) => publisher.books, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'publisherId' })
  publisher?: PublisherEntity;

  @Column({ nullable: true })
  publisherId?: string;

  @ManyToMany(() => GenreEntity, (genre) => genre.books, { eager: true })
  @JoinTable({
    name: 'book_genres',
    joinColumn: {
      name: 'bookId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'genreId',
      referencedColumnName: 'id',
    },
  })
  genres?: GenreEntity[];

  @Column({ nullable: true })
  seriesId?: string;

  @Column({ nullable: true })
  edition?: string;

  @Column({ nullable: true })
  format?: string;
}
