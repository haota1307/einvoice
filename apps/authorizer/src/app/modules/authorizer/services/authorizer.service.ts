import {
  Injectable,
  Logger,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { decode, JwtPayload, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import JwksRsa, { JwksClient } from 'jwks-rsa';

import {
  AuthorizeResponse,
  LoginTcpRequest,
} from '@common/interfaces/tcp/authorizer';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';

@Injectable()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('KEYCLOAK_HOST');
    const realm = this.configService.get<string>('KEYCLOAK_REALM');

    this.jwksClient = JwksRsa({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  async login(params: LoginTcpRequest) {
    const { username, password } = params;

    const { access_token: accessToken, refresh_token: refreshToken } =
      await this.keycloakHttpService.exchangeUserToken({ username, password });

    return { accessToken, refreshToken };
  }

  async verifyUserToken(token: string): Promise<AuthorizeResponse> {
    const decodedToken = decode(token, { complete: true });

    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decodedToken.header.kid);
      const publicKey = key.getPublicKey();
      const payload = verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;

      this.logger.debug({ payload });

      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: [],
          user: null,
          userId: null,
        },
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Invalid token');
    }
  }
}
