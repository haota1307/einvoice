import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Invoice, InvoiceModelName } from '@common/schemas/invoice.schema';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel) {}

  create(data: Partial<Invoice>): Promise<Invoice> {
    return this.invoiceModel.create({
      ...data,
      status: INVOICE_STATUS.CREATED,
    });
  }

  findById(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id);
  }

  updateById(id: string, data: Partial<Invoice>): Promise<Invoice> {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true });
  }

  deleteById(id: string): Promise<Invoice> {
    return this.invoiceModel.findByIdAndDelete(id);
  }
}
