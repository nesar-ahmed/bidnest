import { UserStatus } from '@bidnest/shared';
import { compare, hash } from 'bcryptjs';
import { ALL_ACCOUNTS } from './accounts';
import { type SeedStep, userRepository } from './seed-context';

export const usersSeed: SeedStep = {
  entity: 'users',
  async run(ctx) {
    const users = userRepository(ctx);
    let created = 0;

    for (const account of ALL_ACCOUNTS) {
      const desired = {
        name: account.name,
        role: account.role,
        status: account.status ?? UserStatus.Active,
        nonPaymentCount: account.nonPaymentCount ?? 0,
      };

      const existing = await users.findOneBy({ email: account.email });
      if (!existing) {
        await users.save(
          users.create({
            email: account.email,
            ...desired,
            passwordHash: await hash(account.password, 10),
            emailVerifiedAt: new Date(),
          }),
        );
        created += 1;
        continue;
      }

      const passwordChanged = !(await compare(account.password, existing.passwordHash));
      const verificationMissing = existing.emailVerifiedAt === null;
      const changed =
        passwordChanged ||
        verificationMissing ||
        existing.name !== desired.name ||
        existing.role !== desired.role ||
        existing.status !== desired.status ||
        existing.nonPaymentCount !== desired.nonPaymentCount;

      if (!changed) continue;

      existing.name = desired.name;
      existing.role = desired.role;
      existing.status = desired.status;
      existing.nonPaymentCount = desired.nonPaymentCount;
      if (verificationMissing) existing.emailVerifiedAt = new Date();
      if (passwordChanged) existing.passwordHash = await hash(account.password, 10);
      await users.save(existing);
    }

    return { created };
  },
};
