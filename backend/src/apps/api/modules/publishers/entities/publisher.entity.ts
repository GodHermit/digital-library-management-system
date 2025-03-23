import { Entity, OneToMany, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('publishers')
export class PublisherEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  website?: string;

  @OneToMany(() => BookEntity, (book) => book.publisher)
  books: BookEntity[];
}
