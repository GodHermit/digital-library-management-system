import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrderEntity } from 'src/apps/api/modules/orders/entities/order.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrdersRepository extends Repository<OrderEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(OrderEntity, dataSource.createEntityManager());
  }
}
