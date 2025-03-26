import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrderItemTransactionEntity } from 'src/apps/api/modules/orders/entities/order-item-transaction.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderItemTransactionsRepository extends Repository<OrderItemTransactionEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(OrderItemTransactionEntity, dataSource.createEntityManager());
  }
}
