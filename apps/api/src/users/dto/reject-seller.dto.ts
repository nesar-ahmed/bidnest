import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectSellerDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
