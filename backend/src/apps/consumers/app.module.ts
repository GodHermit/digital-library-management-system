import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/common/configs/app.config';
import { typeOrmConfig } from 'src/common/configs/typeOrm.config';
import { DatabaseModule } from 'src/common/database/database.module';
import { HealthModule } from 'src/common/modules/health/health.module';
import { OrdersTrackerModule } from './modules/orders-tracker/orders-tracker.module';
import { ConfigNames } from 'src/common/types/enums/configNames.enum';
import { BullModule, BullRootModuleOptions } from '@nestjs/bull';
import redisConfig, { IRedisConfig } from 'src/common/configs/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, redisConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): BullRootModuleOptions => {
        const cfg = configService.getOrThrow<IRedisConfig>(ConfigNames.REDIS);

        return {
          url: cfg.url,
          redis: {
            family: cfg.family,
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,

    OrdersTrackerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
