import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { mw as ipMiddleware } from 'request-ip';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '../../common/configs/app.config';
import { ConfigNames } from '../../common/types/enums/configNames.enum';
import { setupSwagger } from 'src/common/utils/setupSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(ipMiddleware());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>(ConfigNames.APP);

  if (!appConfig) {
    throw new Error('App config does not exists');
  }

  const logger = new Logger('App');

  await app.listen(appConfig.port);
  logger.log(
    `Server successfully started on port ${appConfig.port} (http://localhost:${appConfig.port})`,
  );
}
bootstrap();
