import { GraphQlUtils } from './../../utils/graphqlUtils';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '@nestjs/passport';

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
  
    return GraphQlUtils.isGraphQl(context) ? this.canActivateGraphQL(context) : super.canActivate(context);
  }
  canActivateGraphQL(context : ExecutionContext){
    const {req , args} = GraphQlUtils.getGraphQlContextParams(context)
    const { variables } = args;
    if (variables) {
      req.body = variables;
    }
    return super.canActivate(new ExecutionContextHost([req]));
  }
}
