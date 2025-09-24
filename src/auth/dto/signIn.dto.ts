import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class SignInResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
