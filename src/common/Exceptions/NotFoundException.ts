import { CustomError } from './../errors/custome.error';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, NotFoundException } from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    return response.json(
      new CustomError({
        msg: 'not found',
        statusCode: 404,
      }),
    );
  }
}
