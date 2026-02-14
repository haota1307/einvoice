import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Metadata } from '@common/constants/common.constants';
import { getProcessId } from '@common/utils/string.until';

export const ProcessId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[Metadata.PROCESS_ID] || getProcessId();
  },
);
