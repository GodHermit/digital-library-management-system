import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_transactions')
export class OrderTransactionEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity, (order) => order.transactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column()
  orderId: OrderEntity['id'];

  @Column()
  txHash: string;

  @Column({ type: 'double precision' })
  valueInEth: number;
}
