import { Module } from '@nestjs/common';
import { UsersRepository } from 'src/common/database/repositories/users.repository';
import { WalletRepository } from 'src/common/database/repositories/wallets.repository';
import { PrivyAuthService } from '../auth/services/privy-auth.service';
import { UsersService } from '../users/users.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [
    UsersRepository,
    WalletRepository,
    PrivyAuthService,
    UsersService,
  ],
  exports: [],
})
export class OrdersModule {}
