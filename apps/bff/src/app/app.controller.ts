import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: ClientProxy,
  ) {}

  @Get()
  getData() {
    const res = this.appService.getData();
    return new ResponseDto({ data: res });
  }

  @Get('invoices')
  async getInvoices() {
    const res = await firstValueFrom(
      this.invoiceClient.send<string, number>('get_invoices', 1),
    );
    return new ResponseDto<string>({ data: res });
  }
}
