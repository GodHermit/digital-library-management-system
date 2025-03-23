import { Module } from '@nestjs/common';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { WalletRepository } from 'src/common/database/repositories/wallets.repository';
import { PrivyAuthService } from '../auth/services/privy-auth.service';
import { GenresModule } from '../genres/genres.module';
import { PublishersModule } from '../publishers/publishers.module';
import { UsersService } from '../users/users.service';
import { BooksUpdateController } from './books-update.controller';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [GenresModule, PublishersModule],
  controllers: [BooksController, BooksUpdateController],
  providers: [
    UsersRepository,
    WalletRepository,
    PrivyAuthService,
    UsersService,
    BooksService,
    BooksRepository,
  ],
  exports: [BooksService],
})
export class BooksModule {}
