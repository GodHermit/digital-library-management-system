import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrderItemEntity } from 'src/apps/api/modules/orders/entities/order-item.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderItemsRepository extends Repository<OrderItemEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(OrderItemEntity, dataSource.createEntityManager());
  }
}
