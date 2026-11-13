import type { LoginRequestDto } from '@bidnest/shared';
import { IsString, Matches } from 'class-validator';

export class LoginDto implements LoginRequestDto {
  @IsString()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'email must be a valid address' })
  email!: string;

  @IsString()
  password!: string;
}
