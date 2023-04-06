import { ContextUtils } from './../../utils/contextUtils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getQrNationalId = createParamDecorator(
  (_ , ctx : ExecutionContext) => {
    
    const request = ContextUtils.getRequest(ctx);
    const {nationalId} = request.patient; 

    return nationalId
    
  },
);
