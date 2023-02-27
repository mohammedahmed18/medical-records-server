import { GraphQlUtils } from './../../utils/graphqlUtils';
import { JwtPayload } from './../types/index';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUser = createParamDecorator(
  (field: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = GraphQlUtils.isGraphQl(ctx)
      ? GraphQlUtils.getGraphQlContextParams(ctx).req
      : ctx.switchToHttp().getRequest();
    const currrentUser = request.user;

    if (!field) {
      return currrentUser;
    }
    return currrentUser[field];
  },
);
