import { registerAs } from '@nestjs/config';
import * as path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { APP_CONFIG_KEY, DB_CONFIG_KEY } from './config.utils';

export const dbConfig = registerAs(
  DB_CONFIG_KEY,
  (): PostgresConnectionOptions => ({
    type: 'postgres',
    port: +process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: process.env.DB_LOG === 'true',
    synchronize: process.env.DB_SYNC === 'true',
    logger: 'simple-console',

    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    entities: [`${path.resolve(__dirname, '..')}/**/*.entity{.ts,.js}`],
    migrations: [`${path.resolve(__dirname, '..')}/migrations/*{.ts,.js}`],
  }),
);

export const appConfig = registerAs(APP_CONFIG_KEY, () => ({
  port: +process.env.APP_PORT,
  env: process.env.APP_ENV,
  apiPrefix: process.env.API_PREFIX,
}));

export const authConfig = registerAs('auth', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION,
}));

export const smtpConfig = registerAs('smtp', () => ({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM,
}));
