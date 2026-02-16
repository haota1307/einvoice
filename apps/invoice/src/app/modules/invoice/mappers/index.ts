import { Invoice } from '@common/schemas/invoice.schema';
import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';

export const InvoiceRequestMapping = (
  data: CreateInvoiceTcpRequest,
): Partial<Invoice> => {
  return {
    ...data,
    totalAmount: data.items.reduce((total, item) => total + item.total, 0),
    vatAmount: data.items.reduce(
      (total, item) =>
        total + item.unitPrice * item.quantity * (item.vatRate / 100),
      0,
    ),
  };
};
