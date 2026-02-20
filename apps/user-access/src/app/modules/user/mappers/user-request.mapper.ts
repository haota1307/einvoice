import { Types } from 'mongoose';

import { User } from '@common/schemas/user.schema';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';

export const createUserRequestMapper = (
  data: CreateUserTcpRequest,
  userId: string,
): Partial<User> => {
  return {
    ...data,
    userId,
    roles: data.roles.map((role) => new Types.ObjectId(role)) as any,
  };
};
