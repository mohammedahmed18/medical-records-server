import { HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';

export type JwtPayload = {
  id: string;
  nationalId: string;
  name: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  hashedRt: string;
  iat: number;
  exp: number;
  refreshToken?: string;
};


export type CustomErrorOptions = {
  msg : string,
  statusCode ? : HttpStatus,
  errorCode ? : string
}


// TODO: find a way to refactor this with the getcurrentuser decorator
export enum PrivateUserFields { password , hashedRt  ,createdAt  ,updatedAt } // these fields is not important to know in the fronend

export type PublicUser = Omit<User , keyof typeof PrivateUserFields>