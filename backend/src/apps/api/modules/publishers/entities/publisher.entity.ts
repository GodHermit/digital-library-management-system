import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BookEntity } from '../../books/entities/book.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('publishers')
export class PublisherEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  website?: string;

  @OneToMany(() => BookEntity, (book) => book.publisher)
  books: BookEntity[];

  @OneToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'ownedByUserId' })
  ownedBy: UserEntity;

  @Column()
  ownedByUserId: UserEntity['id'];
}
