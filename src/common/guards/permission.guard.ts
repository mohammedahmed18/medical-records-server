import { ContextUtils } from './../../utils/contextUtils';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminPayload } from '../types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!permission) {
      return true;
    }

    const request = ContextUtils.getRequest(context);
    const user = request.user as AdminPayload;
    if (!user || !user.permissions) {
      return false;
    }

    return user.permissions.some((p) => p === permission);
  }
}
