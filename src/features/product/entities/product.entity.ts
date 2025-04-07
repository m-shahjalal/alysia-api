import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { BaseEntity } from '../../../global/orm/base.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Brand, { nullable: true })
  brand: Brand;

  @Column({ nullable: true })
  brandId: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate: number;

  // SEO Fields
  @Column({ length: 255, nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  // Social Media Integration
  @Column({ nullable: true })
  facebookProductId: string;

  // Relationships
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];
}
