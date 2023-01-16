import { JwtPayload } from './../types/index';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUser = createParamDecorator(
  (field: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!field) return request.user;
    return request.user[field];
  },
);
