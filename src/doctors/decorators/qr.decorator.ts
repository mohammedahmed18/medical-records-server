import { applyDecorators, ExecutionContext, Logger, UnauthorizedException, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { CustomError } from 'src/common/errors';
import { EXPIRED_QR_CODE, INVALID_QR_CODE } from 'src/constants';

export class QrGuard extends AuthGuard('qr-jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: Error): any {
    Logger.debug(info.name)

    if (info?.name === "TokenExpiredError") {
        // Handle the expired token error
        throw new CustomError({
            message : "Token has expired",
            errorCode : EXPIRED_QR_CODE,
            statusCode : 401
        });
    }

    if (info?.name === "JsonWebTokenError") {
        // Handle the invalid token error
        throw new CustomError({
            message : "Token is invalid",
            errorCode : INVALID_QR_CODE,
            statusCode : 401
        });
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}

export const ValidateQrCode = () => applyDecorators(UseGuards(QrGuard));