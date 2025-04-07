import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/user/user.module';
import { ProductsModule } from './features/product/products.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule],
  exports: [AuthModule, UsersModule, ProductsModule],
})
export class FeatureModule {}
