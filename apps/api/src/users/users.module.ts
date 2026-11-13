import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSellersController } from './admin-sellers.controller';
import { SellerProfile } from './entities/seller-profile.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, SellerProfile])],
  controllers: [UsersController, AdminSellersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
