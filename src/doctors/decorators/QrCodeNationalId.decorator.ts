import { ContextUtils } from './../../utils/contextUtils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getQrNationalId = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ContextUtils.getRequest(ctx);

    return request.patient.nationalId;
  },
);

export const getQrPatientId = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ContextUtils.getRequest(ctx);

    return request.patient.id;
  },
);
