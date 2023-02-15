import { JwtPayload } from './../types/index';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUser = createParamDecorator(
  (field: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const currrentUser = request.user
      
    if (!field) {
      // return the whole user
      const {createdAt, updatedAt, iat, exp ,...publicFields} = currrentUser
      return publicFields
    }
    return currrentUser[field];
  },
);
