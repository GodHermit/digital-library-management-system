import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { WalletRepository } from './repositories/wallets.repository';
import { BooksRepository } from './repositories/books.repository';
import { GenresRepository } from './repositories/genres.repository';
import { PublishersRepository } from './repositories/publishers.repository';

const REPOSITORIES = [
  UsersRepository,
  WalletRepository,
  BooksRepository,
  GenresRepository,
  PublishersRepository,
];

@Module({
  providers: REPOSITORIES,
  exports: REPOSITORIES,
})
export class DatabaseModule {}
