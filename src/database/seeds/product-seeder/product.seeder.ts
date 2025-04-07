// src/database/seeders/product.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/features/product/entities/brand.entity';
import { Category } from 'src/features/product/entities/category.entity';
import { ProductImage } from 'src/features/product/entities/product-image.entity';
import { Product } from 'src/features/product/entities/product.entity';
import { slugify } from 'src/lib/slugify';
import { Repository } from 'typeorm';

@Injectable()
export class ProductSeeder {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
  ) {}

  async seed(count: number = 50) {
    const existingCount = await this.productRepository.count();
    if (existingCount > 0) {
      console.info(`🌝 Products already seeded (${existingCount} found)`);
      return existingCount;
    }

    // Fetch categories and brands to assign to products
    const categories = await this.categoryRepository.find();
    const brands = await this.brandRepository.find();

    if (categories.length === 0) {
      console.warn(
        '⚠️ No categories found. Make sure to seed categories first.',
      );
      return 0;
    }

    console.info(`\n🚀 Seeding products`);

    const products: Product[] = [];

    for (let i = 1; i <= count; i++) {
      const name = `Product ${i}`;
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const randomBrand =
        brands.length > 0
          ? brands[Math.floor(Math.random() * brands.length)]
          : null;

      const price = +(Math.random() * 1000 + 10).toFixed(2);
      const taxRate = +(Math.random() * 20).toFixed(2);

      const product = this.productRepository.create({
        name,
        title: `Amazing ${name} for your needs`,
        description: `This is a detailed description for ${name}. This product offers great value and quality.`,
        price,
        stock: Math.floor(Math.random() * 100),
        slug: slugify(`${name}-${Date.now()}`),
        category: randomCategory,
        categoryId: randomCategory?.id,
        brand: randomBrand,
        brandId: randomBrand?.id,
        isFeatured: Math.random() > 0.8, // 20% chance to be featured
        isActive: Math.random() > 0.1, // 90% chance to be active
        taxRate,
        metaTitle: `Buy ${name} Online | Best Prices & Deals`,
        metaDescription: `Shop for ${name} with free shipping and great deals. High quality and satisfaction guaranteed.`,
        tags: this.generateRandomTags(),
        facebookProductId: Math.random() > 0.5 ? `fb_${Date.now()}_${i}` : null,
      });

      products.push(product);

      // Save in batches of 20 to avoid memory issues
      if (products.length === 20 || i === count) {
        const savedProducts = await this.productRepository.save(products);

        // Create images for each saved product
        for (const product of savedProducts) {
          await this.createImagesForProduct(product);
        }

        products.length = 0; // Clear the array
      }
    }

    console.info(`🌿 Products seeded successfully`);
    return count;
  }

  private async createImagesForProduct(product: Product) {
    const numImages = Math.floor(Math.random() * 4) + 1;
    const images: ProductImage[] = [];

    for (let i = 0; i < numImages; i++) {
      const image = new ProductImage();
      image.product = product;
      image.productId = product.id as any; // Type assertion to match the expected type
      image.imageUrl = `/products/${product.id}/image-${i + 1}.jpg`;
      image.altText = `${product.name} - Image ${i + 1}`;
      image.isPrimary = i === 0;
      image.displayOrder = i;

      images.push(image);
    }

    await this.imageRepository.save(images);
  }

  private generateRandomTags(): string[] {
    const allTags = [
      'new',
      'sale',
      'bestseller',
      'trending',
      'limited',
      'premium',
      'eco-friendly',
      'handmade',
      'organic',
      'vegan',
      'sustainable',
      'recycled',
      'natural',
      'exclusive',
      'vintage',
    ];

    const numberOfTags = Math.floor(Math.random() * 5) + 1; // 1-5 tags
    const selectedTags: string[] = [];

    for (let i = 0; i < numberOfTags; i++) {
      const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!selectedTags.includes(randomTag)) {
        selectedTags.push(randomTag);
      }
    }

    return selectedTags;
  }
}
