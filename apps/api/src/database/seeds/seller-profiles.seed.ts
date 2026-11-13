import { ALL_ACCOUNTS } from './accounts';
import { type SeedStep, sellerProfileRepository, userRepository } from './seed-context';

export const sellerProfilesSeed: SeedStep = {
  entity: 'seller_profiles',
  async run(ctx) {
    const users = userRepository(ctx);
    const profiles = sellerProfileRepository(ctx);
    let created = 0;

    for (const account of ALL_ACCOUNTS) {
      if (!account.seller) continue;

      const user = await users.findOneBy({ email: account.email });
      if (!user) {
        throw new Error(`seller_profiles seed: user ${account.email} not found — run the users seed first`);
      }

      const desired = {
        sellerType: account.seller.sellerType,
        businessName: account.seller.businessName ?? null,
        kycStatus: account.seller.kycStatus,
        rejectionReason: account.seller.rejectionReason ?? null,
      };

      const existing = await profiles.findOneBy({ userId: user.id });
      if (!existing) {
        await profiles.save(profiles.create({ userId: user.id, ...desired }));
        created += 1;
        continue;
      }

      const changed =
        existing.sellerType !== desired.sellerType ||
        existing.businessName !== desired.businessName ||
        existing.kycStatus !== desired.kycStatus ||
        existing.rejectionReason !== desired.rejectionReason;

      if (!changed) continue;

      Object.assign(existing, desired);
      await profiles.save(existing);
    }

    return { created };
  },
};
