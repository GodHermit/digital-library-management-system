import { Module } from '@nestjs/common';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { WalletRepository } from 'src/common/database/repositories/wallets.repository';
import { PrivyAuthService } from '../auth/services/privy-auth.service';
import { UsersService } from '../users/users.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from 'src/common/database/repositories/order.repository';
import { OrderItemsRepository } from 'src/common/database/repositories/order-item.repository';
import { OrderTransactionsRepository } from 'src/common/database/repositories/order-transaction.repository';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { OrdersService } from './orders.service';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [UsersModule, AuthModule, BooksModule],
  controllers: [OrdersController],
  providers: [
    UsersRepository,
    WalletRepository,
    PrivyAuthService,
    UsersService,
    OrdersRepository,
    OrderItemsRepository,
    OrderTransactionsRepository,
    OrdersService,
  ],
  exports: [
    OrdersRepository,
    OrderItemsRepository,
    OrderTransactionsRepository,
    OrdersService,
  ],
})
export class OrdersModule {}
