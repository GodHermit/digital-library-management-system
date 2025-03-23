import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/common/configs/app.config';
import { typeOrmConfig } from 'src/common/configs/typeOrm.config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/common/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { OrdersModule } from './modules/orders/orders.module';
import { HealthModule } from 'src/common/modules/health/health.module';
import { GenresModule } from './modules/genres/genres.module';
import { PublishersModule } from './modules/publishers/publishers.module';
import redisConfig from 'src/common/configs/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, redisConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,

    AuthModule,
    UsersModule,
    BooksModule,
    GenresModule,
    PublishersModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
