import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import {catchError, Observable, throwError} from 'rxjs'
import { error_msgs, prismaErrors } from 'src/constants';
import { CustomError } from '../errors';



@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError((err) => {
          
        // prisma unique error
        if (err instanceof PrismaClientKnownRequestError && err.code === prismaErrors.INSERT_UNIQUE )
            throw new CustomError({
            msg : error_msgs.RESOURCE_ALREADY_EXISTS(err.meta?.target[0]),
            statusCode : 400,
            errorCode : prismaErrors.INSERT_UNIQUE
            })

          // Check if a custom error is provided
          if (err?.response) {
            if(typeof err.response === "string"){
            return throwError(() => new CustomError({msg : err.response, statusCode : err.status}) )
            }
            const {message , errorCode , statusCode} = err.response
            return throwError(() => new CustomError({msg : message ,errorCode , statusCode}) )
          } else {
            // something went wrong
            Logger.error("::: " + err.message);
            return throwError(() => new CustomError({msg : "internal server error",statusCode : 500}) )
          }
        }),
      );
  }
}
