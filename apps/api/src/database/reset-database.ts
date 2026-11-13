import 'reflect-metadata';
import { existsSync, unlinkSync } from 'node:fs';
import { DataSource } from 'typeorm';
import { seedDatabase } from './seeds/seed-database';
import { databaseFile, typeormOptions } from './typeorm.config';

async function main(): Promise<void> {
  const file = databaseFile();
  console.log(`Resetting dev database: ${file}`);

  for (const suffix of ['', '-journal', '-wal', '-shm']) {
    const path = `${file}${suffix}`;
    if (existsSync(path)) unlinkSync(path);
  }

  const dataSource = new DataSource(typeormOptions());
  await dataSource.initialize();

  try {
    const applied = await dataSource.runMigrations();
    console.log(`Applied ${applied.length} migration(s).`);

    const { steps } = await seedDatabase(dataSource);
    for (const step of steps) {
      console.log(`  ${step.entity.padEnd(16)} ${step.created} created`);
    }
    console.log('Reset complete. Run `npm run db:show` to inspect the data.');
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Reset failed:', error);
  process.exitCode = 1;
});
