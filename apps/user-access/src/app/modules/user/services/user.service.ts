import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { CODE_ERROR } from '@common/constants/enum/code-error.enum';
import { createUserRequestMapper } from '../mappers/user-request.mapper';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateKeycloakUserTcpRequest } from '@common/interfaces/tcp/authorizer';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { firstValueFrom, map } from 'rxjs';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE)
    private readonly authorizerService: TcpClient,
  ) {}

  async create(data: CreateUserTcpRequest, processId: string) {
    const { email, firstName, lastName, password } = data;

    const existingUser = await this.userRepository.exists(email);

    if (existingUser) {
      throw new BadRequestException(CODE_ERROR.USER_ALREADY_EXISTS);
    }

    const userId = await this.createKeycloakUser(
      {
        email,
        firstName,
        lastName,
        password,
      },
      processId,
    );

    const input = createUserRequestMapper(data, userId);

    return this.userRepository.create(input);
  }

  createKeycloakUser(data: CreateKeycloakUserTcpRequest, processId: string) {
    return firstValueFrom(
      this.authorizerService
        .send(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
