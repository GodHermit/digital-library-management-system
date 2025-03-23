import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { EOrderStatus } from '../types/order.enum';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @ManyToOne(() => BookEntity, (book) => book.id)
  @JoinColumn({ name: 'bookId' })
  book: BookEntity;

  @Column()
  bookId: BookEntity['id'];

  @Column({ type: 'timestamptz' })
  orderedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'orderedByUserId' })
  orderedBy: UserEntity;

  @Column()
  orderedByUserId: UserEntity['id'];

  @Column({ enum: EOrderStatus, default: EOrderStatus.PENDING })
  status: EOrderStatus;

  @Column({ nullable: true })
  orderTxHash?: string;

  @Column({ nullable: true, type: 'double precision' })
  paidPriceInETH?: number;

  @Column({ nullable: true, type: 'timestamptz' })
  orderCompletedOrClosedAt?: Date;

  @Column({ nullable: true })
  closeReason?: string;
}
