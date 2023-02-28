import { ContextUtils } from './../../utils/contextUtils';
import { JwtPayload } from './../types/index';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUser = createParamDecorator(
  (field: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ContextUtils.getRequest(ctx);
    const currrentUser = request.user;

    if (!field) {
      return currrentUser;
    }
    return currrentUser[field];
  },
);
