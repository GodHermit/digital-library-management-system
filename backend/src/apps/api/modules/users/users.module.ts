import { forwardRef, Module } from '@nestjs/common';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { WalletRepository } from 'src/common/database/repositories/wallets.repository';
import { AuthModule } from '../auth/auth.module';
import { PublishersModule } from '../publishers/publishers.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => PublishersModule)],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, WalletRepository, BooksRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
