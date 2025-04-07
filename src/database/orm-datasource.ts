import { DataSource } from 'typeorm';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ isGlobal: true });

const dataSource = new DataSource({
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
  entities: [`${path.resolve(__dirname, '../**/*.entity{.ts,.js}')}`],
  migrations: [`${path.resolve(__dirname, './migrations/*{.ts,.js}')}`],
  migrationsTableName: 'migrations',
});

export default dataSource;
