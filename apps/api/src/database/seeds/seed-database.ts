import type { DataSource } from 'typeorm';
import { type SeedResult, makeSeedContext, type SeedStep } from './seed-context';
import { sellerProfilesSeed } from './seller-profiles.seed';
import { usersSeed } from './users.seed';

// Order matters: users before rows that reference them.
export const SEED_STEPS: SeedStep[] = [usersSeed, sellerProfilesSeed];

export interface SeedRunResult {
  steps: Array<{ entity: string } & SeedResult>;
}

export async function seedDatabase(dataSource: DataSource): Promise<SeedRunResult> {
  const ctx = makeSeedContext(dataSource);
  const steps: SeedRunResult['steps'] = [];

  for (const step of SEED_STEPS) {
    const result = await step.run(ctx);
    steps.push({ entity: step.entity, ...result });
  }

  return { steps };
}
