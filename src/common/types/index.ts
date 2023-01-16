export type User = {
  id: string;
  nationalId: string;
  name: string;
  email?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  hashedRt: string;
};

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
