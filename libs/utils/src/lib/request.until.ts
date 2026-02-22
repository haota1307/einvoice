import { parseToken } from './string.until';

export function getAccessToken(request: any, keepBearer = false): string {
  const token =
    request?.headers['authorization'] || request.headers['Authorization'];

  return keepBearer ? token : parseToken(token);
}
