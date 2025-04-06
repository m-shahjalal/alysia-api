export type StringKeys<T> = Extract<keyof T, string>;

export type Path<T> = T extends object
  ? {
      [K in StringKeys<T>]: T[K] extends object ? K | `${K}.${Path<T[K]>}` : K;
    }[StringKeys<T>]
  : never;

export type PathValue<T, P extends Path<T>> =
  P extends StringKeys<T>
    ? T[P]
    : P extends `${infer K}.${infer Rest}`
      ? K extends StringKeys<T>
        ? Rest extends Path<T[K]>
          ? PathValue<T[K], Rest>
          : never
        : never
      : never;

export function isConfigPath<T>(
  obj: T,
  path: string,
): path is Path<T> & string {
  return (
    path.split('.').reduce((acc: any, key) => {
      if (acc === undefined) return undefined;
      return acc[key];
    }, obj) !== undefined
  );
}

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'staging',
}

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  migrations: string[];
  synchronize: boolean;
  logging: boolean | string[];
  ssl: boolean;
  autoLoadEntities?: boolean;
}

export interface AuthConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  port: number;
  env: Environment;
  apiPrefix: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  smtp: SmtpConfig;
}

export const DB_CONFIG_KEY = 'database';
export const AUTH_CONFIG_KEY = 'auth';
export const APP_CONFIG_KEY = 'app';
export const SMTP_CONFIG_KEY = 'smtp';
