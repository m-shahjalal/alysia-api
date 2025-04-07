import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import {
  appConfig,
  authConfig,
  dbConfig,
  smtpConfig,
} from './config/register.config';
import { validate } from './config/validate.config';
import { MailService } from './features/mail/mail.service';
import { AllExceptionsFilter } from './global/filters/all-exceptions.filter';
import { LoggingInterceptor } from './global/interceptors/logging.interceptor';
import { TransformInterceptor } from './global/interceptors/transform.interceptor';
import { LoggerModule } from './global/logger/logger.module';
import { FeatureModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig, appConfig, authConfig, smtpConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({ useFactory: dbConfig }),

    LoggerModule,
    FeatureModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    MailService,
  ],
  exports: [LoggerModule, MailService],
  controllers: [AppController],
})
export class AppModule {}
