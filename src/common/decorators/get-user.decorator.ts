import { ContextUtils } from './../../utils/contextUtils';
import { JwtPayload } from './../types/index';
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

type getCurrentUserOptions = {
  field?: keyof JwtPayload;
  isDoctor?: boolean;
};
export const getCurrentUser = createParamDecorator(
  (options: getCurrentUserOptions, ctx: ExecutionContext) => {
    const request = ContextUtils.getRequest(ctx);
    const currrentUser = request.user;

    if (options.isDoctor && !currrentUser.medicalSpecialization) {
      throw new ForbiddenException('only doctors are allowed');
    }
    if (!options.field) {
      return currrentUser;
    }
    return currrentUser[options.field];
  },
);
