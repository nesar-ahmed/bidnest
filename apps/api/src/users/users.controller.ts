import { type AuthUserDto, type SellerApplicationResponseDto } from '@bidnest/shared';
import { Body, Controller, Get, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthPrincipal } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerApplicationDto } from './dto/seller-application.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiCookieAuth('access_token')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  async me(@CurrentUser() auth: AuthPrincipal): Promise<AuthUserDto> {
    return this.users.toAuthDto(auth.user);
  }

  @Patch('me')
  async updateMe(@CurrentUser() auth: AuthPrincipal, @Body() dto: UpdateProfileDto): Promise<AuthUserDto> {
    const user = await this.users.updateName(auth.user.id, dto.name);
    return this.users.toAuthDto(user);
  }

  @Post('me/seller-application')
  @HttpCode(201)
  async applyAsSeller(
    @CurrentUser() auth: AuthPrincipal,
    @Body() dto: SellerApplicationDto,
  ): Promise<SellerApplicationResponseDto> {
    const profile = await this.users.applyAsSeller(auth.user.id, {
      sellerType: dto.sellerType,
      businessName: dto.businessName,
    });
    return { kycStatus: profile.kycStatus, sellerType: profile.sellerType, businessName: profile.businessName };
  }
}
