import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { error_msgs, prismaErrors } from 'src/constants';
import { CustomError } from '../errors';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // prisma unique error
        if (err?.code === prismaErrors.INSERT_UNIQUE)
          throw new CustomError({
            message: error_msgs.RESOURCE_ALREADY_EXISTS(err.meta?.target[0]),
            statusCode: 400,
            errorCode: prismaErrors.INSERT_UNIQUE,
          });

        // prisma forigen key error
        if (err?.code === prismaErrors.FOREIGN_KEY_CONSTRAINT) {
          const field = err.meta.field_name
            .split('_')[1]
            .toLowerCase()
            .split('id')[0];
          throw new CustomError({
            message: `this ${field} not found`,
            statusCode: 404,
            errorCode: prismaErrors.FOREIGN_KEY_CONSTRAINT,
          });
        }

        if (err?.code === prismaErrors.NO_RECORDS_UPDATED) {
          throw new CustomError({
            message: `no records found to update`,
            statusCode: 404,
            errorCode: prismaErrors.NO_RECORDS_UPDATED,
          });
        }
        
        //unhandled prisma code error
        if(err.code){
          Logger.error("unhandled prisma error code ")
          Logger.debug( {err})
        }

        // Check if a custom error is provided
        if (err?.response) {
          if (typeof err.response === 'string') {
            return throwError(
              () =>
                new CustomError({
                  message: err.response,
                  statusCode: err.status,
                }),
            );
          }
          const { message, errorCode, statusCode } = err.response;
          return throwError(
            () => new CustomError({ message: message, errorCode, statusCode }),
          );
        } else {
          // something went wrong
          // TODO: for now we will show the error for the sake of development but later we shouldn't show sensitive information about the server for users
          Logger.error('::: ' + err.message);
          // return throwError(() => new CustomError({message : "internal server error",statusCode : 500}) )
          // return throwError(
          //   () => new CustomError({ message: err.message, statusCode: 500 }),
          // );
        }
      }),
    );
  }
}
