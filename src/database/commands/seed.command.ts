import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../seeds/seeder.module';
import { UserSeeder } from '../seeds/user.seeder';
import { CategorySeeder } from '../seeds/product-seeder/category.seeder';
import { BrandSeeder } from '../seeds/product-seeder/brand.seeder';
import { AttributeSeeder } from '../seeds/product-seeder/attribute.seeder';
import { ProductSeeder } from '../seeds/product-seeder/product.seeder';
import { ProductVariantSeeder } from '../seeds/product-seeder/variant.seeder';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  try {
    console.info('\n🌱🌱 SEEDING STARTED\n');
    // Seed users
    const userSeeder = appContext.get(UserSeeder);
    await userSeeder.seed();

    // Seed categories
    const categorySeeder = appContext.get(CategorySeeder);
    await categorySeeder.seed(16);

    // Seed brands
    const brandSeeder = appContext.get(BrandSeeder);
    await brandSeeder.seed(10);

    // Seed attributes
    const attributeSeeder = appContext.get(AttributeSeeder);
    await attributeSeeder.seed();

    // Seed products
    const productSeeder = appContext.get(ProductSeeder);
    await productSeeder.seed(50);

    // Seed product variants and images
    const productVariantSeeder = appContext.get(ProductVariantSeeder);
    await productVariantSeeder.seed();

    console.info('\n🌲🎋 SEEDING COMPLETED\n');
  } catch (error) {
    console.error('\n🚫 Database seeding failed:', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
