import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrderEntity } from 'src/apps/api/modules/orders/entities/order.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../utils/base-repository';

@Injectable()
export class OrdersRepository extends BaseRepository(OrderEntity) {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
}
