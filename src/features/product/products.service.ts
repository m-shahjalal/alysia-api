import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceResult } from 'src/global/request/api-response.dto';
import { QueryParamDto } from 'src/global/request/query-param.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepo.create(createProductDto);
    return this.productRepo.save(product);
  }

  async findAll(pagination: QueryParamDto): Promise<ServiceResult<Product>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'updatedAt',
      sortOrder = 'DESC',
    } = pagination;

    const [items, total] = await this.productRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder },
    });

    return {
      data: items as any,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Verify product exists
    await this.productRepo.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
