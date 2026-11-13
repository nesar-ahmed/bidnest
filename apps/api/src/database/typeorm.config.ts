import '../config/env'; // must run before databaseFile() reads process.env
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { DataSourceOptions } from 'typeorm';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { apiRoot, resolveFromApiRoot } from '../config/paths';
import { SellerProfile } from '../users/entities/seller-profile.entity';
import { User } from '../users/entities/user.entity';

// Shared by the app, the TypeORM CLI and the seed scripts; migrations own the schema.
export const ENTITIES = [User, SellerProfile, RefreshToken];

// Relative paths resolve against apps/api. `:memory:` must pass through untouched —
// resolving it would create a literal 0-byte file named ":memory:".
export function databaseFile(): string {
  const configured = process.env.DATABASE_FILE?.trim();
  if (!configured) return join(apiRoot(), 'bidnest.db');
  if (isInMemoryDatabase(configured)) return configured;
  return resolveFromApiRoot(configured);
}

function isInMemoryDatabase(database: string): boolean {
  return database === ':memory:' || database.startsWith('file::memory:');
}

export function typeormOptions(): DataSourceOptions {
  const database = databaseFile();
  mkdirSync(dirname(database), { recursive: true });

  return {
    type: 'better-sqlite3',
    database,
    entities: ENTITIES,
    // ts-node loads .ts, the build loads .js.
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    synchronize: false,
    migrationsRun: false,
    logging: process.env.DB_LOGGING === 'true' ? ['query', 'error'] : ['error'],
  };
}
