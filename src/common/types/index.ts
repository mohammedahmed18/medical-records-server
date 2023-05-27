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
  medicalSpecialization: string | null;
};

export type AdminPayload = {
  permissions: string[];
  id: string;
  username: string;
};

export type CustomErrorOptions = {
  message: string;
  statusCode?: HttpStatus;
  errorCode?: string;
};
export type CachedUserInfo = {
  image_src: string;
};
