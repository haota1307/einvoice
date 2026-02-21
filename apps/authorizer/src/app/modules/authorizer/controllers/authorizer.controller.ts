import { Controller } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { AuthorizerService } from '../services/authorizer.service';
import {
  LoginTcpRequest,
  LoginTcpResponse,
} from '@common/interfaces/tcp/authorizer';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';

@Controller()
export class AuthorizerController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN)
  async login(@RequestParams() body: LoginTcpRequest) {
    const result = await this.authorizerService.login(body);

    return Response.success<LoginTcpResponse>(result);
  }
}
