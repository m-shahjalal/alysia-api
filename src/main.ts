import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { APP_CONFIG_KEY, AppConfig } from './config/config.utils';
import { customOptions, swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService).get<AppConfig>(APP_CONFIG_KEY);

  app.enableCors();

  app.setGlobalPrefix(config.apiPrefix, {
    exclude: ['/ping', '/health', '/docs', '/'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(config.port);
  console.info(`🚀🚀 http://localhost:${config.port}`);
}

bootstrap();
