import { KycStatus, SellerType, UserRole, UserStatus, type AuthUserDto } from '@bidnest/shared';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerProfile } from './entities/seller-profile.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(SellerProfile) private readonly sellers: Repository<SellerProfile>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOneBy({ email: email.toLowerCase().trim() });
  }

  async findById(id: string): Promise<User> {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    return user;
  }

  create(data: { name: string; email: string; passwordHash: string; verified?: boolean }): Promise<User> {
    return this.users.save(
      this.users.create({
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: UserRole.Buyer,
        status: UserStatus.Active,
        emailVerifiedAt: data.verified ? new Date() : null,
      }),
    );
  }

  async updateName(id: string, name: string): Promise<User> {
    const user = await this.findById(id);
    user.name = name;
    return this.users.save(user);
  }

  // A rejected application can be edited and resubmitted; pending/verified ones are returned as-is.
  async applyAsSeller(
    userId: string,
    input: { sellerType: SellerType; businessName?: string },
  ): Promise<SellerProfile> {
    const user = await this.findById(userId);
    if (user.role !== UserRole.Buyer) {
      throw new ConflictException({ code: 'ALREADY_SELLER', message: 'This account is not a buyer' });
    }
    if (input.sellerType === SellerType.Business && !input.businessName) {
      throw new BadRequestException({
        code: 'BUSINESS_NAME_REQUIRED',
        message: 'businessName is required when applying as a business',
      });
    }

    const values = {
      sellerType: input.sellerType,
      businessName: input.sellerType === SellerType.Business ? input.businessName! : null,
    };

    const existing = await this.sellers.findOneBy({ userId });
    if (existing && existing.kycStatus !== KycStatus.Rejected) {
      return existing;
    }
    if (existing) {
      Object.assign(existing, values, { kycStatus: KycStatus.Pending, rejectionReason: null });
      return this.sellers.save(existing);
    }
    return this.sellers.save(this.sellers.create({ userId, kycStatus: KycStatus.Pending, ...values }));
  }

  async approveSeller(userId: string): Promise<User> {
    const user = await this.findById(userId);
    const profile = await this.sellers.findOneBy({ userId });
    if (!profile) throw new NotFoundException({ code: 'NO_APPLICATION', message: 'No seller application found' });
    profile.kycStatus = KycStatus.Verified;
    profile.rejectionReason = null;
    await this.sellers.save(profile);
    user.role = UserRole.Seller;
    return this.users.save(user);
  }

  async rejectSeller(userId: string, reason: string): Promise<SellerProfile> {
    const profile = await this.sellers.findOneBy({ userId });
    if (!profile) throw new NotFoundException({ code: 'NO_APPLICATION', message: 'No seller application found' });
    profile.kycStatus = KycStatus.Rejected;
    profile.rejectionReason = reason;
    return this.sellers.save(profile);
  }

  // Never includes passwordHash.
  async toAuthDto(user: User): Promise<AuthUserDto> {
    const profile = await this.sellers.findOneBy({ userId: user.id });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      sellerKyc: profile?.kycStatus,
    };
  }

  async assertUsable(user: User): Promise<void> {
    if (user.status === UserStatus.Banned) {
      throw new ForbiddenException({ code: 'ACCOUNT_BANNED', message: 'This account has been banned' });
    }
    if (user.status === UserStatus.Suspended) {
      throw new ForbiddenException({ code: 'ACCOUNT_SUSPENDED', message: 'This account is suspended' });
    }
  }
}
