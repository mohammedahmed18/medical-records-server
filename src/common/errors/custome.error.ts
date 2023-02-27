import { HttpException } from '@nestjs/common';
import { CustomErrorOptions } from '../types';

export class CustomError extends HttpException {
  constructor(options: CustomErrorOptions) {
    options.statusCode = options.statusCode || 500;
    options['message'] = options.msg;
    delete options.msgd;
    super(options, options.statusCode);
  }
}
