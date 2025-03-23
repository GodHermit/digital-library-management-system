import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BRAND_NAME } from '../constants/brand';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle(`${BRAND_NAME} API`)
    .setVersion('1.0.0')
    .addBearerAuth({
      name: 'authorization',
      description: 'Access token for authentication (may start with "Bearer ")',
      in: 'header',
      type: 'apiKey',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
