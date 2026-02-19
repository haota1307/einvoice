import { MessagePattern } from '@nestjs/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';

import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { UserService } from '../services/user.service';
import { RequestParam } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Controller('user')
@UseInterceptors(TcpLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(
    @RequestParam() params: CreateUserTcpRequest,
  ): Promise<Response<string>> {
    await this.userService.create(params);
    return Response.success<string>(HTTP_MESSAGE.CREATED);
  }
}
