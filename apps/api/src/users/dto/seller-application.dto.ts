import { SellerType, type SellerApplicationRequestDto } from '@bidnest/shared';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SellerApplicationDto implements SellerApplicationRequestDto {
  @IsIn([SellerType.Individual, SellerType.Business])
  sellerType!: SellerType;

  // Required when sellerType is Business — enforced in the service.
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  businessName?: string;
}
