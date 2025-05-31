import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BookEntity } from '../../books/entities/book.entity';
import { OrderEntity } from './order.entity';
import { OrderItemTransactionEntity } from './order-item-transaction.entity';

@Entity('order_items')
export class OrderItemEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column()
  orderId: OrderEntity['id'];

  @ManyToOne(() => BookEntity, (book) => book.id, {
    eager: true,
  })
  @JoinColumn({ name: 'bookId' })
  book: BookEntity;

  @Column()
  bookId: BookEntity['id'];

  @Column({ type: 'double precision' })
  priceInETH: number;

  @OneToMany(
    () => OrderItemTransactionEntity,
    (transaction) => transaction.item,
    {
      eager: true,
    },
  )
  transactions?: OrderItemTransactionEntity[];
}
