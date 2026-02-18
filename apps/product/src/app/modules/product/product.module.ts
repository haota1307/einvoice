import { Module } from '@nestjs/common';

import { TypeOrmProviders } from '@common/configuration/type-orm.config';

@Module({
  imports: [TypeOrmProviders],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProductModule {}
