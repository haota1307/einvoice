import { MessagePattern } from '@nestjs/microservices';
import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { RequestParam } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
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
  getInvoice(
    @RequestParam('invoiceId') invoiceId: number,
    @ProcessId() processId: string,
  ): Response<string> {
    return Response.success<string>(
      `Invoice with ID ${invoiceId} retrieved successfully for process ${processId}`,
    );
  }
}
