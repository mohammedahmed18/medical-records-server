export type User = {
  id: string;
  name: string;
  nationalId: string;
  email?: string;
  password: string;
};


export type JwtPayload = {
  id: string;
  email: string;
  name : string;
  sub: number;
}