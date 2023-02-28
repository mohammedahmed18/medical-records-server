import { HttpStatus } from '@nestjs/common';

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

export type AdminPayload = {
  permissions: string[];
  id: string;
  username: string;
};

export type CustomErrorOptions = {
  msg: string;
  statusCode?: HttpStatus;
  errorCode?: string;
};
