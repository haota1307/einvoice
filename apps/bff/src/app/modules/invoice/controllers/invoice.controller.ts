import { map } from 'rxjs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import {
  CreateInvoiceRequestDto,
  InvoiceResponseDto,
} from '@common/interfaces/gateway/invoice';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import {
  CreateInvoiceTcpRequest,
  InvoiceTcpResponse,
} from '@common/interfaces/tcp/invoice';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { AuthorizedMetadata } from '@common/interfaces/tcp/authorizer';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(
    @Inject(TCP_SERVICES.INVOICE_SERVICE)
    private readonly invoiceClient: TcpClient,
  ) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  create(
    @Body() body: CreateInvoiceRequestDto,
    @ProcessId() processId: string,
    @UserData() userData: AuthorizedMetadata,
  ) {
    return this.invoiceClient
      .send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(
        TCP_REQUEST_MESSAGE.INVOICE.CREATE,
        {
          data: body,
          processId,
        },
      )
      .pipe(map((data) => new ResponseDto(data)));
  }
}
