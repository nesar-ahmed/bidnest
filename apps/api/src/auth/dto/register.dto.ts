import type { RegisterRequestDto } from '@bidnest/shared';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto implements RegisterRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsString()
  @MinLength(10, { message: 'password must be at least 10 characters' })
  @MaxLength(200)
  password!: string;
}
