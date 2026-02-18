import { BadRequestException, Injectable } from '@nestjs/common';

import {
  CreateProductTcpRequest,
  ProductTcpResponse,
} from '@common/interfaces/tcp/product';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: CreateProductTcpRequest) {
    const { sku, name } = data;

    const existingProduct = await this.productRepository.existsBySku(sku, name);

    if (existingProduct) {
      throw new Error('Product with this SKU already exists');
    }

    return this.productRepository.create(data);
  }

  getAll(): Promise<ProductTcpResponse[]> {
    return this.productRepository.findAll();
  }
}
