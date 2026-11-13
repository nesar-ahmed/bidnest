import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { seedDatabase } from './seed-database';

async function main(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const applied = await AppDataSource.runMigrations();
    if (applied.length > 0) {
      console.log(`Applied ${applied.length} pending migration(s): ${applied.map((m) => m.name).join(', ')}`);
    }

    const { steps } = await seedDatabase(AppDataSource);
    for (const step of steps) {
      console.log(`  ${step.entity.padEnd(16)} ${step.created} created`);
    }
    console.log('Seed complete. Run `npm run db:show` to inspect the data.');
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
});
