import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

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
    );
  }
}
