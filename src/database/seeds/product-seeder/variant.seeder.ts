// src/database/seeders/product-variant.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeValue } from 'src/features/product/entities/attribute-value.entity';
import { Attribute } from 'src/features/product/entities/attribute.entity';

import { ProductVariant } from 'src/features/product/entities/product-variant.entity';
import { Product } from 'src/features/product/entities/product.entity';
import { VariantAttributeValue } from 'src/features/product/entities/variant-attribute-value.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductVariantSeeder {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,

    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(VariantAttributeValue)
    private readonly variantAttributeValueRepository: Repository<VariantAttributeValue>,
  ) {}

  async seed() {
    const variantCount = await this.variantRepository.count();
    if (variantCount > 0) {
      console.info(
        `🌝 Product variants already seeded (${variantCount} found)`,
      );
      return;
    }

    console.info(`\n🚀 Seeding product variants`);

    // Get all products
    const products = await this.productRepository.find();
    if (products.length === 0) {
      console.warn('⚠️ No products found. Make sure to seed products first.');
      return;
    }

    // Get all attributes and their values
    const attributes = await this.attributeRepository.find();
    const attributeValues = await this.attributeValueRepository.find({
      relations: ['attribute'],
    });

    // Group attribute values by attribute id
    const attributeValuesMap = new Map<number, AttributeValue[]>();
    attributes.forEach((attr) => {
      attributeValuesMap.set(
        attr.id,
        attributeValues.filter((av) => av.attributeId === attr.id),
      );
    });

    // Create variants for each product
    for (const product of products) {
      // Determine which attributes to use for this product
      const productAttributes = this.selectRandomAttributes(attributes);
      if (productAttributes.length === 0) continue;

      // Create variants for the product
      await this.createVariantsForProduct(
        product,
        productAttributes,
        attributeValuesMap,
      );
    }

    console.info(`🌿 Product variants seeded successfully`);
  }

  private selectRandomAttributes(attributes: Attribute[]): Attribute[] {
    // Select 1-3 random attributes for the product
    const maxAttrs = Math.min(3, attributes.length);
    const numAttrs = Math.floor(Math.random() * maxAttrs) + 1;

    // Shuffle attributes and take the first numAttrs
    const shuffled = [...attributes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numAttrs);
  }

  private async createVariantsForProduct(
    product: Product,
    productAttributes: Attribute[],
    attributeValuesMap: Map<number, AttributeValue[]>,
  ): Promise<ProductVariant[]> {
    const numVariants = Math.floor(Math.random() * 4) + 1; // 1-5 variants
    const variants: ProductVariant[] = [];

    for (let i = 0; i < numVariants; i++) {
      // Create a new variant instance manually
      const variant = new ProductVariant();
      variant.product = product; // Set the relation
      variant.productId = product.id as any; // Type assertion to match the expected type
      variant.sku = `SKU-${product.id}-${i + 1}`;
      variant.barcode =
        Math.random() > 0.3 ? `BARCODE-${product.id}-${i + 1}` : null;
      variant.price = +Number(
        product.price * (0.9 + Math.random() * 0.3),
      ).toFixed(2);
      variant.compareAtPrice =
        Math.random() > 0.7 ? +Number(product.price * 1.2).toFixed(2) : null;
      variant.costPrice = +Number(product.price * 0.5).toFixed(2);
      variant.weight = +Number(Math.random() * 5 + 0.5).toFixed(2);
      variant.weightUnit = Math.random() > 0.3 ? 'kg' : 'lb';
      variant.isActive = true;

      const savedVariant = await this.variantRepository.save(variant);
      variants.push(savedVariant);

      // Add attribute values
      for (const attr of productAttributes) {
        const attrValues = attributeValuesMap.get(attr.id) || [];
        if (attrValues.length === 0) continue;

        const randomValue =
          attrValues[Math.floor(Math.random() * attrValues.length)];

        const variantAttrValue = new VariantAttributeValue();
        variantAttrValue.variant = savedVariant;
        variantAttrValue.variantId = savedVariant.id;
        variantAttrValue.attributeValue = randomValue;
        variantAttrValue.attributeValueId = randomValue.id;

        await this.variantAttributeValueRepository.save(variantAttrValue);
      }
    }

    return variants;
  }
}
