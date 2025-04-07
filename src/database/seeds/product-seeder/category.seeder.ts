// src/database/seeders/category.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/features/product/entities/category.entity';
import { slugify } from 'src/lib/slugify';
import { Repository } from 'typeorm';

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seed(count: number = 10) {
    const existingCount = await this.categoryRepository.count();
    if (existingCount > 0) {
      console.info(`🌝 Categories already seeded (${existingCount} found)`);
      return existingCount;
    }

    console.info(`\n🚀 Seeding categories`);

    // Create main categories first (without parents)
    const mainCategoriesCount = Math.ceil(count / 3); // About 1/3 will be main categories
    const mainCategories = await this.createMainCategories(mainCategoriesCount);

    // Create subcategories
    const remainingCount = count - mainCategoriesCount;
    if (remainingCount > 0) {
      await this.createSubcategories(remainingCount, mainCategories);
    }

    console.info(`🌿 Categories seeded successfully`);
    return count;
  }

  private async createMainCategories(count: number): Promise<Category[]> {
    const categories: Category[] = [];

    for (let i = 1; i <= count; i++) {
      const name = `Category ${i}`;
      const category = this.categoryRepository.create({
        name,
        description: `This is the description for ${name}`,
        slug: slugify(name),
        isActive: true,
        metaTitle: `${name} - Shop the best products`,
        metaDescription: `Discover our collection of ${name.toLowerCase()} products with great deals and discounts.`,
      });

      categories.push(category);
    }

    return await this.categoryRepository.save(categories);
  }

  private async createSubcategories(
    count: number,
    parentCategories: Category[],
  ) {
    const subcategories: Category[] = [];

    for (let i = 1; i <= count; i++) {
      // Select a random parent category
      const parentCategory =
        parentCategories[Math.floor(Math.random() * parentCategories.length)];
      const name = `Subcategory ${i} of ${parentCategory.name}`;

      const subcategory = this.categoryRepository.create({
        name,
        description: `This is a subcategory of ${parentCategory.name}`,
        slug: slugify(name),
        parent: parentCategory,
        parentId: parentCategory.id,
        isActive: Math.random() > 0.1, // 90% chance to be active
        metaTitle: `${name} - Shop our collection`,
        metaDescription: `Explore our ${name.toLowerCase()} collection with exclusive deals and best quality.`,
      });

      subcategories.push(subcategory);
    }

    await this.categoryRepository.save(subcategories);
  }
}
