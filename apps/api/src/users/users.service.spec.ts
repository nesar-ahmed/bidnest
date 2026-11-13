import { KycStatus, SellerType, UserRole, UserStatus } from '@bidnest/shared';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { Repository } from 'typeorm';
import type { SellerProfile } from './entities/seller-profile.entity';
import type { User } from './entities/user.entity';
import { UsersService } from './users.service';

function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    email: 'buyer@example.com',
    name: 'Buyer',
    passwordHash: 'hash',
    role: UserRole.Buyer,
    status: UserStatus.Active,
    nonPaymentCount: 0,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as User;
}

function buildSellerProfile(overrides: Partial<SellerProfile> = {}): SellerProfile {
  return {
    id: 'profile-1',
    userId: 'user-1',
    sellerType: SellerType.Individual,
    businessName: null,
    kycStatus: KycStatus.Pending,
    rejectionReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as SellerProfile;
}

function createFixture() {
  const users = {
    findOneBy: vi.fn(),
    save: vi.fn(),
    create: vi.fn((value: unknown) => value),
  };
  const sellers = {
    findOneBy: vi.fn(),
    save: vi.fn(async (value: unknown) => value),
    create: vi.fn((value: unknown) => value),
  };

  const service = new UsersService(
    users as unknown as Repository<User>,
    sellers as unknown as Repository<SellerProfile>,
  );

  return { service, users, sellers };
}

describe('UsersService.applyAsSeller', () => {
  it('creates a pending individual application without a business name', async () => {
    const { service, users, sellers } = createFixture();
    users.findOneBy.mockResolvedValue(buildUser());
    sellers.findOneBy.mockResolvedValue(null);

    const profile = await service.applyAsSeller('user-1', {
      sellerType: SellerType.Individual,
      businessName: 'Ignored for individuals',
    });

    expect(profile).toMatchObject({
      userId: 'user-1',
      sellerType: SellerType.Individual,
      businessName: null,
      kycStatus: KycStatus.Pending,
    });
    expect(sellers.save).toHaveBeenCalledOnce();
  });

  it('keeps the business name for a business application', async () => {
    const { service, users, sellers } = createFixture();
    users.findOneBy.mockResolvedValue(buildUser());
    sellers.findOneBy.mockResolvedValue(null);

    const profile = await service.applyAsSeller('user-1', {
      sellerType: SellerType.Business,
      businessName: 'Studio Volt',
    });

    expect(profile).toMatchObject({
      sellerType: SellerType.Business,
      businessName: 'Studio Volt',
      kycStatus: KycStatus.Pending,
    });
  });

  it('rejects a business application that has no business name', async () => {
    const { service, users, sellers } = createFixture();
    users.findOneBy.mockResolvedValue(buildUser());

    await expect(service.applyAsSeller('user-1', { sellerType: SellerType.Business })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(sellers.save).not.toHaveBeenCalled();
  });

  it('rejects applications from accounts that are not buyers', async () => {
    const { service, users } = createFixture();
    users.findOneBy.mockResolvedValue(buildUser({ role: UserRole.Seller }));

    await expect(service.applyAsSeller('user-1', { sellerType: SellerType.Individual })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('returns the existing application when one is already pending', async () => {
    const { service, users, sellers } = createFixture();
    const pending = buildSellerProfile();
    users.findOneBy.mockResolvedValue(buildUser());
    sellers.findOneBy.mockResolvedValue(pending);

    const profile = await service.applyAsSeller('user-1', {
      sellerType: SellerType.Individual,
    });

    expect(profile).toBe(pending);
    expect(sellers.save).not.toHaveBeenCalled();
  });
});

describe('UsersService.toAuthDto', () => {
  it('exposes the seller KYC status without leaking the password hash', async () => {
    const { service, sellers } = createFixture();
    sellers.findOneBy.mockResolvedValue(buildSellerProfile({ kycStatus: KycStatus.Verified }));

    const dto = await service.toAuthDto(buildUser());

    expect(dto).toMatchObject({
      id: 'user-1',
      email: 'buyer@example.com',
      role: UserRole.Buyer,
      sellerKyc: KycStatus.Verified,
    });
    expect(dto).not.toHaveProperty('passwordHash');
  });
});
