import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { KeycloakHttpService } from '../services/keycloak-http.service';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateKeycloakUserTcpRequest } from '@common/interfaces/tcp/authorizer';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class KeycloakController {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER)
  async createUser(
    @RequestParams() data: CreateKeycloakUserTcpRequest,
  ): Promise<Response<string>> {
    const result = await this.keycloakHttpService.createUser(data);
    return Response.success<string>(result);
  }
}
