import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PERMISSION } from '@common/constants/enum/role.enum';
import { MetadataKeys } from '@common/constants/common.constants';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';
import { Permissions } from '@common/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<PERMISSION[]>(
      Permissions,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userData = request[MetadataKeys.USER_DATA] as AuthorizeResponse;
    const userPermissions = userData.MetadataKeys.permissions as PERMISSION[];

    const isValid = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!isValid) {
      throw new ForbiddenException(
        "Permission denied: You don't have the required permissions.",
      );
    }

    return isValid;
  }
}
