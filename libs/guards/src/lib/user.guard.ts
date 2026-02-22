import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Metadata } from '@common/constants/common.constants';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflector.get<{ secured: boolean }>(
      Metadata.SECURED,
      context.getHandler(),
    );

    if (authOptions?.secured) {
      return false; // Hiện tại đang mặc định chặn nếu có yêu cầu bảo mật
    }

    return true;
  }
}
