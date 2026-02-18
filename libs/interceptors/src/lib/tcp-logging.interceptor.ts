import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = new Date();
    const handler = context.getHandler();
    const handlerName = handler.name;

    const args = context.getArgs();
    const param = args[0];
    const processId = param?.processId || 'unknown';

    Logger.log(
      `TCP >> Starting process ${processId} at ${now.toISOString()} - Method: ${handlerName} >> Param: ${JSON.stringify(param)}`,
    );

    return next.handle().pipe(
      tap(() => {
        Logger.log(
          `TCP >> Completed process ${processId} at ${new Date().toISOString()} - Duration: ${new Date().getTime() - now.getTime()}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now.getTime();
        Logger.error(
          `
          TCP >> Error in process ${processId} after ${duration}ms
              >> Error: ${error.message}
          `,
        );
        throw new RpcException({
          code:
            error.status ||
            error.code ||
            error.error?.code ||
            HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            error.response?.message ||
            error?.message ||
            HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
          duration,
        });
      }),
    );
  }
}
