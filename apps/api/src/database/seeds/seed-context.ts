import type { DataSource } from 'typeorm';
import { SellerProfile } from '../../users/entities/seller-profile.entity';
import { User } from '../../users/entities/user.entity';

export interface SeedContext {
  dataSource: DataSource;
}

export interface SeedResult {
  created: number;
}

export interface SeedStep {
  entity: string;
  run: (ctx: SeedContext) => Promise<SeedResult>;
}

export function makeSeedContext(dataSource: DataSource): SeedContext {
  return { dataSource };
}

export function userRepository(ctx: SeedContext) {
  return ctx.dataSource.getRepository(User);
}

export function sellerProfileRepository(ctx: SeedContext) {
  return ctx.dataSource.getRepository(SellerProfile);
}
