import { parseToken } from './string.until';
import { Metadata } from '@common/constants/common.constants';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';

export function getAccessToken(request: any, keepBearer = false): string {
  const token =
    request?.headers['authorization'] || request.headers['Authorization'];

  return keepBearer ? token : parseToken(token);
}

export function setUserData(request: any, userData?: AuthorizeResponse): void {
  request[Metadata.USER_DATA] = userData;
}
