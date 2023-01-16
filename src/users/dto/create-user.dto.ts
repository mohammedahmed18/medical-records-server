import { UserLoginDto } from 'src/auth/dto/user-login.dto';
export class CreateUserDto extends UserLoginDto {
  name: string;
  email?: string;
}
