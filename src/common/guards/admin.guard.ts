import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GraphQlUtils } from 'src/utils/graphqlUtils';

@Injectable()
export class AdminGuard extends AuthGuard('admin-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isAdmin = this.reflector.getAllAndOverride<boolean>('isAdmin', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isAdmin) {
      return true;
    }

    return GraphQlUtils.isGraphQl(context)
      ? this.canActivateGraphQL(context)
      : super.canActivate(context);
  }
  canActivateGraphQL(context: ExecutionContext) {
    const { req, args } = GraphQlUtils.getGraphQlContextParams(context);
    const { variables } = args;
    if (variables) {
      req.body = variables;
    }
    return super.canActivate(new ExecutionContextHost([req]));
  }
}
