import { MessagePattern } from '@nestjs/microservices';
import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_invoices')
  getInvoice(invoiceId: number) {
    return `Invoice data for invoice #${invoiceId}`;
  }
}
