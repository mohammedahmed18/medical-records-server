import { ContextUtils } from './../../utils/contextUtils';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DoctorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {

    const request = ContextUtils.getRequest(context);
    const user = request.user;
    const isDoctor = user && !!user.medicalSpecialization;

    return isDoctor;
  }
}
