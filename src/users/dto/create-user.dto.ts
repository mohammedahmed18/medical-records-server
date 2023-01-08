import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserLoginDto } from './../../auth/dto/user-login.dto';

export class CreateUserDto extends UserLoginDto {

    @IsNotEmpty()
    name : string

    @IsOptional()
    @IsEmail()
    email ?: string
}