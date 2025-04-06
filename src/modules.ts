import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/user/user.module';

@Module({
  imports: [AuthModule, UsersModule],
  exports: [AuthModule, UsersModule],
})
export class FeatureModule {}
