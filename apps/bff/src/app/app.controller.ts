import { map } from 'rxjs';
import { Controller, Get, Inject } from '@nestjs/common';

import { AppService } from './app.service';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: TcpClient,
  ) {}

  @Get()
  getData() {
    const res = this.appService.getData();
    return new ResponseDto({ data: res });
  }

  @Get('invoices')
  async getInvoices(@ProcessId() processId: string) {
    const result = this.invoiceClient
      .send<string, number>('get_invoices', {
        processId,
        data: 10,
      })
      .pipe(
        map((response) => new ResponseDto<string>({ data: response.data })),
      );

    return result;
  }
}
