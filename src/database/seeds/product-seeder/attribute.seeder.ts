// src/database/seeders/attribute.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeValue } from 'src/features/product/entities/attribute-value.entity';
import { Attribute } from 'src/features/product/entities/attribute.entity';
import { slugify } from 'src/lib/slugify';
import { Repository } from 'typeorm';

@Injectable()
export class AttributeSeeder {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
  ) {}

  async seed() {
    const existingCount = await this.attributeRepository.count();
    if (existingCount > 0) {
      console.info(`🌝 Attributes already seeded (${existingCount} found)`);
      return;
    }

    console.info(`\n🚀 Seeding attributes`);

    // Define common product attributes
    const attributeDefinitions = [
      {
        name: 'Color',
        displayName: 'Color',
        values: [
          'Red',
          'Blue',
          'Green',
          'Black',
          'White',
          'Yellow',
          'Purple',
          'Orange',
          'Grey',
        ],
      },
      {
        name: 'Size',
        displayName: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
      },
      {
        name: 'Material',
        displayName: 'Material',
        values: [
          'Cotton',
          'Polyester',
          'Leather',
          'Wool',
          'Silk',
          'Denim',
          'Canvas',
        ],
      },
      {
        name: 'Storage',
        displayName: 'Storage Capacity',
        values: ['64GB', '128GB', '256GB', '512GB', '1TB'],
      },
      {
        name: 'RAM',
        displayName: 'RAM',
        values: ['4GB', '8GB', '16GB', '32GB', '64GB'],
      },
    ];

    // Create attributes and their values
    for (const attrDef of attributeDefinitions) {
      const attribute = this.attributeRepository.create({
        name: attrDef.name,
        displayName: attrDef.displayName,
        slug: slugify(attrDef.name),
        description: `Product ${attrDef.name.toLowerCase()} options`,
      });

      await this.attributeRepository.save(attribute);

      // Create attribute values
      const attributeValues = attrDef.values.map((val) =>
        this.attributeValueRepository.create({
          attribute,
          attributeId: attribute.id,
          value: slugify(val),
          displayValue: val,
        }),
      );

      await this.attributeValueRepository.save(attributeValues);
    }

    console.info(`🌿 Attributes seeded successfully`);
  }
}
