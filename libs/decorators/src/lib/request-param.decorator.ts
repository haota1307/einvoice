import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestParam = createParamDecorator(
  (param: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return param ? request[param] : request.data[param];
  },
);
