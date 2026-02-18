import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '@common/entities/product.entity';
import { TypeOrmProviders } from '@common/configuration/type-orm.config';

@Module({
  imports: [TypeOrmProviders, TypeOrmModule.forFeature([Product])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProductModule {}
