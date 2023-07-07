import { GraphQlUtils } from './../../utils/graphqlUtils';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '@nestjs/passport';
import { ContextUtils } from 'src/utils/contextUtils';
import jwt_decode from 'jwt-decode';
@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isAdmin = this.reflector.getAllAndOverride<boolean>('isAdmin', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isAdmin) {
      const req = ContextUtils.getRequest(context);

      const accessToken = req.cookies?.token;

      const decoded: any = jwt_decode(accessToken);
      const isCurrentUserAdmin = !!decoded?.admin;
      if (!isCurrentUserAdmin) return false;
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
