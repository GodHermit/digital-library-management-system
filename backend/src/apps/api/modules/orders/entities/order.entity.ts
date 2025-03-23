import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { EOrderStatus } from '../types/order.enum';
import { OrderItemEntity } from './order-item.entity';
import { OrderTransactionEntity } from './order-transaction.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'orderedByUserId' })
  orderedBy: UserEntity;

  @Column()
  orderedByUserId: UserEntity['id'];

  @Column({ type: 'timestamptz' })
  orderedAt: Date;

  @Column({ enum: EOrderStatus, default: EOrderStatus.PENDING })
  status: EOrderStatus;

  @Column({ nullable: true, type: 'timestamptz' })
  orderCompletedOrClosedAt?: Date;

  @Column({ nullable: true })
  closeReason?: string;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  items: OrderItemEntity[];

  @OneToMany(() => OrderTransactionEntity, (transaction) => transaction.order, {
    cascade: true,
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  transactions?: OrderTransactionEntity[];
}
