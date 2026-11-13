import { UserRole, type AuthUserDto } from '@bidnest/shared';
import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RejectSellerDto } from './dto/reject-seller.dto';
import { UsersService } from './users.service';

@ApiTags('admin')
@ApiCookieAuth('access_token')
@Controller('admin/sellers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AdminSellersController {
  constructor(private readonly users: UsersService) {}

  @Post(':userId/approve')
  @HttpCode(201)
  async approve(@Param('userId') userId: string): Promise<AuthUserDto> {
    return this.users.toAuthDto(await this.users.approveSeller(userId));
  }

  @Post(':userId/reject')
  @HttpCode(201)
  async reject(@Param('userId') userId: string, @Body() body: RejectSellerDto) {
    const profile = await this.users.rejectSeller(userId, body?.reason ?? 'Rejected by admin');
    return { kycStatus: profile.kycStatus, rejectionReason: profile.rejectionReason };
  }
}
