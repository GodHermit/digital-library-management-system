import { forwardRef, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { privyConfig } from 'src/common/configs/privy.config';
import { AuthController } from './auth.controller';
import { PrivyAuthService } from './services/privy-auth.service';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from 'src/common/database/repositories/users.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [privyConfig],
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [PrivyAuthService, AuthService, UsersRepository],
  exports: [PrivyAuthService, AuthService],
})
export class AuthModule {}
