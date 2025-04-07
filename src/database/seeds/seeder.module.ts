import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/features/user/user.entity';
import { UserSeeder } from './user.seeder';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from 'src/config/register.config';
import { CategorySeeder } from './product-seeder/category.seeder';
import { Category } from 'src/features/product/entities/category.entity';
import { BrandSeeder } from './product-seeder/brand.seeder';
import { ProductSeeder } from './product-seeder/product.seeder';
import { Brand } from 'src/features/product/entities/brand.entity';
import { Product } from 'src/features/product/entities/product.entity';
import { AttributeSeeder } from './product-seeder/attribute.seeder';
import { ProductVariantSeeder } from './product-seeder/variant.seeder';
import { Attribute } from 'src/features/product/entities/attribute.entity';
import { AttributeValue } from 'src/features/product/entities/attribute-value.entity';
import { ProductVariant } from 'src/features/product/entities/product-variant.entity';
import { ProductImage } from 'src/features/product/entities/product-image.entity';
import { VariantAttributeValue } from 'src/features/product/entities/variant-attribute-value.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
    TypeOrmModule.forRootAsync({ useFactory: dbConfig }),
    TypeOrmModule.forFeature([
      User,
      Category,
      Brand,
      Product,
      Attribute,
      AttributeValue,
      ProductVariant,
      ProductImage,
      VariantAttributeValue,
    ]),
  ],
  providers: [
    UserSeeder,
    CategorySeeder,
    ProductSeeder,
    BrandSeeder,
    AttributeSeeder,
    ProductVariantSeeder,
  ],
  exports: [
    UserSeeder,
    CategorySeeder,
    ProductSeeder,
    BrandSeeder,
    AttributeSeeder,
    ProductVariantSeeder,
  ],
})
export class SeederModule {}
