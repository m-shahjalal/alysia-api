import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Path,
  PathValue,
  Environment,
  Config,
  AppConfig,
  DatabaseConfig,
  AuthConfig,
} from './config.utils';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  public get<P extends Path<Config>>(path: P): PathValue<Config, P> {
    return this.configService.get<PathValue<Config, P>>(
      path,
      undefined,
    ) as PathValue<Config, P>;
  }

  public get app(): AppConfig {
    return {
      port: this.configService.get<number>('APP_PORT'),
      env: this.configService.get<Environment>('APP_ENV'),
      apiPrefix: this.configService.get<string>('API_PREFIX'),
    };
  }

  public get databaseConfig(): DatabaseConfig {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USER', 'postgres'),
      password: this.configService.get('DB_PASS', 'postgres'),
      database: this.configService.get('DB_NAME', 'postgres'),
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      migrations: ['./database/migrations/*.ts'],
      synchronize: this.configService.get('DB_SYNC', false),
      logging: this.configService.get('DB_LOG', ['error']),
      ssl: this.configService.get('DB_SSL', false) ? true : false,
    };
  }

  public get auth(): AuthConfig {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      refreshSecret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      refreshExpiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRATION',
      ),
    };
  }

  public get smtp() {
    return {
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      user: this.configService.get<string>('SMTP_USER'),
      pass: this.configService.get<string>('SMTP_PASS'),
      from: this.configService.get<string>('SMTP_FROM'),
    };
  }
}
