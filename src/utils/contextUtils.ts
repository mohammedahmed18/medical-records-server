import { ExecutionContext } from '@nestjs/common';
import { GraphQlUtils } from './graphqlUtils';

export class ContextUtils {
  static getRequest(ctx: ExecutionContext) {
    return GraphQlUtils.isGraphQl(ctx)
      ? GraphQlUtils.getGraphQlContextParams(ctx).req
      : ctx.switchToHttp().getRequest();
  }
}
