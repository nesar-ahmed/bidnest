import 'reflect-metadata';
import { AppDataSource } from './data-source';

async function main(): Promise<void> {
  await AppDataSource.initialize();

  try {
    if (process.argv.includes('--revert')) {
      await AppDataSource.undoLastMigration();
      console.log('Reverted the last migration.');
      return;
    }

    const applied = await AppDataSource.runMigrations();
    if (applied.length === 0) {
      console.log('No migrations are pending.');
      return;
    }

    console.log(`Applied ${applied.length} migration(s):`);
    for (const migration of applied) {
      console.log(`  - ${migration.name}`);
    }
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
