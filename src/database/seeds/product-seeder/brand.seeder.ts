// src/database/seeders/brand.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/features/product/entities/brand.entity';
import { slugify } from 'src/lib/slugify';
import { Repository } from 'typeorm';

@Injectable()
export class BrandSeeder {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async seed(count: number = 15) {
    const existingCount = await this.brandRepository.count();
    if (existingCount > 0) {
      console.info(`🌝 Brands already seeded (${existingCount} found)`);
      return existingCount;
    }

    console.info(`\n🚀 Seeding brands`);

    const brands: Brand[] = [];

    const brandNames = [
      'TechElite',
      'EcoSolutions',
      'PrimeCraft',
      'InnovateX',
      'PureStyle',
      'NaturalFlow',
      'UrbanChic',
      'ClassicEdge',
      'PeakPerformance',
      'SmartLife',
      'GlobalGear',
      'VividDesign',
      'NextGeneration',
      'ProActive',
      'DreamWorks',
      'OptimalChoice',
      'TrendSetter',
      'EliteForce',
      'MasterCraft',
      'FlexiSolutions',
    ];

    // Use either provided count or all brand names if count is larger
    const brandsToCreate = Math.min(count, brandNames.length);

    for (let i = 0; i < brandsToCreate; i++) {
      const name = brandNames[i];

      const brand = this.brandRepository.create({
        name,
        description: `${name} is a leading brand in its industry, known for quality and innovation.`,
        slug: slugify(name),
        logoUrl: `/brands/${slugify(name)}.png`, // Example path for logo
        isActive: Math.random() > 0.1, // 90% chance to be active
      });

      brands.push(brand);
    }

    await this.brandRepository.save(brands);

    console.info(`🌿 Brands seeded successfully`);
    return brandsToCreate;
  }
}
