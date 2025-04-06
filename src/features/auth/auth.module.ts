import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/user.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from 'src/global/guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerModule } from 'src/global/logger/logger.module';
import { EmailModule } from 'src/features/mail/mail.module';
import { AUTH_CONFIG_KEY, AuthConfig } from 'src/config/config.utils';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    LoggerModule,
    EmailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configInstance: ConfigService) => {
        const config = configInstance.get<AuthConfig>(AUTH_CONFIG_KEY);
        if (!config) throw new Error('Auth configuration is not defined');

        return {
          secret: config.secret,
          signOptions: { expiresIn: config.expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtRefreshStrategy, AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
