import { Types } from 'mongoose';

import { User } from '@common/schemas/user.schema';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';

export const createUserRequestMapper = (
  data: CreateUserTcpRequest,
): Partial<User> => {
  return {
    ...data,
    roles: data.roles.map((role) => new Types.ObjectId(role)) as any,
  };
};
