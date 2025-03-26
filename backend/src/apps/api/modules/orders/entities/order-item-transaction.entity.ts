import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import {
  EOrderItemTransactionReceiverType,
  EOrderItemTransactionStatus,
} from '../types/order-item-transaction.enum';
import { Address } from 'viem';

@Entity('order_item_transactions')
export class OrderItemTransactionEntity extends BaseEntity {
  @ManyToOne(() => OrderItemEntity, (item) => item.transactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: OrderItemEntity;

  @Column()
  itemId: OrderItemEntity['id'];

  @Column({
    enum: EOrderItemTransactionStatus,
    default: EOrderItemTransactionStatus.PENDING,
  })
  status: EOrderItemTransactionStatus;

  @Column({ enum: EOrderItemTransactionReceiverType })
  receiverType: EOrderItemTransactionReceiverType;

  @Column({ type: 'uuid' })
  receiverId: string;

  @Column()
  receiver: Address;

  @Column({ type: 'double precision' })
  valueInEth: number;

  @Column({ nullable: true })
  hash?: string;
}
