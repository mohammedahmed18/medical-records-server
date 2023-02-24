import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  isRest(context: ExecutionContext): boolean{
    return GqlExecutionContext.create(context).getType() === "http";
  }

   canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
  
    return this.isRest(context) ? super.canActivate(context) : this.canActivateGraphQL(context);
  }
  canActivateGraphQL(context : ExecutionContext){
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const { variables } = ctx.getArgs();
    if (variables) {
      req.body = variables;
    }
    return super.canActivate(new ExecutionContextHost([req]));
  }
}
