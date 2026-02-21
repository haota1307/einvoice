import { Injectable, UseInterceptors } from '@nestjs/common';

import { LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';

@Injectable()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerService {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  async login(params: LoginTcpRequest) {
    const { username, password } = params;

    const { access_token: accessToken, refresh_token: refreshToken } =
      await this.keycloakHttpService.exchangeUserToken({ username, password });

    return { accessToken, refreshToken };
  }
}
