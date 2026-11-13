import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { AppDataSource } from './data-source';
import { ALL_ACCOUNTS } from './seeds/accounts';
import { databaseFile } from './typeorm.config';

function dashboardFor(role: string): string {
  if (role === 'admin' || role === 'moderator') return '/admin';
  if (role === 'seller') return '/seller';
  return '/account';
}

async function main(): Promise<void> {
  const file = databaseFile();
  console.log(`\nDatabase: ${file}\n`);

  if (!existsSync(file)) {
    console.log('No database yet. Run `npm run db:migrate && npm run db:seed` first.');
    return;
  }

  await AppDataSource.initialize();

  try {
    let migrations: Array<{ name: string }> = [];
    try {
      migrations = await AppDataSource.query('SELECT name FROM migrations ORDER BY id');
    } catch {
      console.log('Migrations table not found — run `npm run db:migrate`.');
    }
    console.log(`Applied migrations (${migrations.length}):`);
    console.table(migrations);

    const tables = ['users', 'seller_profiles', 'refresh_tokens'];
    const counts: Array<{ table: string; rows: number }> = [];
    for (const table of tables) {
      const [row] = await AppDataSource.query(`SELECT COUNT(*) AS rows FROM "${table}"`);
      counts.push({ table, rows: row.rows });
    }
    console.log('Row counts:');
    console.table(counts);

    const users = await AppDataSource.query(`
      SELECT u.email,
             u.name,
             u.role,
             u.status,
             u.nonPaymentCount AS strikes,
             sp.kycStatus AS sellerKyc,
             COALESCE(sp.businessName, sp.sellerType) AS seller
      FROM users u
      LEFT JOIN seller_profiles sp ON sp.userId = u.id
      ORDER BY u.role, u.email
    `);
    console.log('Users (with seller profile):');
    console.table(users);

    const profiles = await AppDataSource.query(`
      SELECT sp.businessName, sp.sellerType, sp.kycStatus, sp.rejectionReason, u.email
      FROM seller_profiles sp
      JOIN users u ON u.id = sp.userId
      ORDER BY sp.kycStatus, u.email
    `);
    console.log('Seller profiles:');
    console.table(profiles);

    console.log('Seed login credentials:');
    console.table(
      ALL_ACCOUNTS.map((account) => ({
        role: account.role,
        email: account.email,
        password: account.password,
        dashboard: dashboardFor(account.role),
        sellerKyc: account.seller?.kycStatus ?? '—',
      })),
    );
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Could not read the database:', error);
  process.exitCode = 1;
});
