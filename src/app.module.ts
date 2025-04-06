import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  authConfig,
  dbConfig,
  smtpConfig,
} from './config/register.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig, appConfig, authConfig, smtpConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
