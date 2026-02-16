import { MongoProvider } from '@common/configuration/mongo.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InvoiceService } from './services/app.service';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceRepository } from './repositories/invoice.repositories';
import { InvoiceDestination } from '@common/schemas/invoice.schema';

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([InvoiceDestination])],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
