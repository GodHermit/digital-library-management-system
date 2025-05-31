import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { WalletRepository } from './repositories/wallets.repository';
import { BooksRepository } from './repositories/books.repository';
import { GenresRepository } from './repositories/genres.repository';
import { PublishersRepository } from './repositories/publishers.repository';
import { OrdersRepository } from './repositories/order.repository';
import { OrderItemsRepository } from './repositories/order-item.repository';
import { OrderTransactionsRepository } from './repositories/order-transaction.repository';
import { OrderItemTransactionsRepository } from './repositories/order-item-transaction.repository';

const REPOSITORIES = [
  UsersRepository,
  WalletRepository,
  BooksRepository,
  GenresRepository,
  PublishersRepository,
  OrdersRepository,
  OrderItemsRepository,
  OrderTransactionsRepository,
  OrderItemTransactionsRepository,
];

@Module({
  providers: REPOSITORIES,
  exports: REPOSITORIES,
})
export class DatabaseModule {}
