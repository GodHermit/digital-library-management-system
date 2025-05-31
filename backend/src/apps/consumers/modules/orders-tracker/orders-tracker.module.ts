import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { OrderTransactionsRepository } from 'src/common/database/repositories/order-transaction.repository';
import { OrdersRepository } from 'src/common/database/repositories/order.repository';
import { ORDERS_QUEUE } from './constants/queue';
import { OrdersTrackerConsumer } from './orders-tracker.consumer';
import { OrdersTrackerService } from './orders-tracker.service';
import { OrderItemTransactionsRepository } from 'src/common/database/repositories/order-item-transaction.repository';
import { PublishersRepository } from 'src/common/database/repositories/publishers.repository';
import { UsersRepository } from 'src/common/database/repositories/users.repository';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ORDERS_QUEUE,
    }),
  ],
  providers: [
    OrdersTrackerService,
    OrdersTrackerConsumer,
    OrdersRepository,
    OrderTransactionsRepository,
    OrderItemTransactionsRepository,
    PublishersRepository,
    UsersRepository,
  ],
  exports: [OrdersTrackerService, OrdersTrackerConsumer],
})
export class OrdersTrackerModule {}
