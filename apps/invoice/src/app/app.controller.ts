import { MessagePattern } from '@nestjs/microservices';
import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { Request } from '@common/interfaces/tcp/common/request.interface';
import { Response } from '@common/interfaces/tcp/common/response.interface';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_invoices')
  getInvoice({
    data: invoiceId,
    processId,
  }: Request<number>): Response<string> {
    return Response.success<string>(
      `Invoice with ID ${invoiceId} retrieved successfully for process ${processId}`,
    );
  }
}
