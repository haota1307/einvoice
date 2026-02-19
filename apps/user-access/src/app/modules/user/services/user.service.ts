import { BadRequestException, Injectable } from '@nestjs/common';

import { CODE_ERROR } from '@common/constants/enum/code-error.enum';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapper } from '../mappers/user-request.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserTcpRequest) {
    const { email } = data;

    const existingUser = await this.userRepository.exists(email);

    if (existingUser) {
      throw new BadRequestException(CODE_ERROR.USER_ALREADY_EXISTS);
    }

    const input = createUserRequestMapper(data);

    return this.userRepository.create(input);
  }
}
