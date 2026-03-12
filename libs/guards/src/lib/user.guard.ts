import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { firstValueFrom, map, Observable } from 'rxjs';

import { MetadataKeys } from '@common/constants/common.constants';
import { getAccessToken, setUserData } from '@common/utils/request.until';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';
import { Cache } from 'cache-manager';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE)
    private readonly authorizerClient: TcpClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflector.get<{ secured: boolean }>(
      MetadataKeys.SECURED,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();

    if (!authOptions?.secured) {
      return true;
    }

    return this.verifyToken(request);
  }

  private async verifyToken(request: any): Promise<boolean> {
    try {
      const token = getAccessToken(request);
      const cacheKey = this.generateTokenCacheKey(token);

      const processId =
        request[MetadataKeys.PROCESS_ID] || 'unknown-process-id';

      const cacheData =
        await this.cacheManager.get<AuthorizeResponse>(cacheKey);

      if (cacheData) {
        setUserData(request, cacheData);
        return true;
      }

      const result = await this.verifyUserToken(token, processId);

      if (!result?.valid) {
        throw new UnauthorizedException('Token is invalid or missing');
      }

      setUserData(request, result);

      this.cacheManager.set(cacheKey, result, 30 * 60 * 1000);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or missing');
    }
  }

  private async verifyUserToken(token: string, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(
          TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN,
          {
            data: token,
            processId,
          },
        )
        .pipe(map((data) => data.data)),
    );
  }

  generateTokenCacheKey(token: string) {
    const hash = createHash('sha256').update(token).digest('hex');
    return `user-token:${hash}`;
  }
}
