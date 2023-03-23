import { ContextUtils } from './../../utils/contextUtils';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DoctorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requireDoctor = this.reflector.getAllAndOverride<boolean>(
      'requireDoctor',
      [context.getHandler(), context.getClass()],
    );
    if (!requireDoctor) return true;

    const request = ContextUtils.getRequest(context);
    const user = request.user;
    const isDoctor = user && !!user.medicalSpecialization;

    return isDoctor;
  }
}
