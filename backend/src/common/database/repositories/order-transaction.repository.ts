import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrderTransactionEntity } from 'src/apps/api/modules/orders/entities/order-transaction.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderTransactionsRepository extends Repository<OrderTransactionEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(OrderTransactionEntity, dataSource.createEntityManager());
  }
}
