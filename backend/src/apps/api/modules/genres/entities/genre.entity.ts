import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, ManyToMany, Column } from 'typeorm';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('genres')
export class GenreEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => BookEntity, (book) => book.genres)
  books: BookEntity[];
}
