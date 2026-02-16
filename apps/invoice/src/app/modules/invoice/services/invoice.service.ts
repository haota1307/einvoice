import { Injectable } from '@nestjs/common';

import { InvoiceRepository } from '../repositories/invoice.repositories';
import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { InvoiceRequestMapping } from '../mappers';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  create(params: CreateInvoiceTcpRequest) {
    const input = InvoiceRequestMapping(params);

    return this.invoiceRepository.create(input);
  }
}
