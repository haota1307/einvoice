import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { getProcessId } from '@common/utils/string.until';
import { MetadataKeys } from '@common/constants/common.constants';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;
    const processId = getProcessId();

    (req as any)[MetadataKeys.PROCESS_ID] = processId;
    (req as any)[MetadataKeys.START_TIME] = startTime;

    Logger.log(
      `HTTP >>> start process ${processId} - ${method} ${originalUrl} at ${startTime} - Input: ${JSON.stringify(body)}`,
    );

    const originalSend = res.send.bind(res);

    res.send = (body?: any): Response => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      Logger.log(
        `HTTP >>> end process ${processId} - ${method} ${originalUrl} at ${endTime} - Duration: ${duration}ms`,
      );

      return originalSend(body);
    };

    next();
  }
}
