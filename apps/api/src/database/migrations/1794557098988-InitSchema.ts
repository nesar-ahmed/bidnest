import type { MigrationInterface, QueryRunner } from 'typeorm';

// IF NOT EXISTS lets databases created by the old `synchronize` mode adopt migrations without a wipe.
export class InitSchema1794557098988 implements MigrationInterface {
  name = 'InitSchema1794557098988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" (
        "id" varchar PRIMARY KEY NOT NULL,
        "email" varchar NOT NULL,
        "name" varchar NOT NULL,
        "passwordHash" varchar NOT NULL,
        "role" varchar NOT NULL DEFAULT ('buyer'),
        "status" varchar NOT NULL DEFAULT ('active'),
        "nonPaymentCount" integer NOT NULL DEFAULT (0),
        "emailVerifiedAt" datetime,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "seller_profiles" (
        "id" varchar PRIMARY KEY NOT NULL,
        "userId" varchar NOT NULL,
        "sellerType" varchar NOT NULL DEFAULT ('individual'),
        "businessName" varchar,
        "kycStatus" varchar NOT NULL DEFAULT ('pending'),
        "rejectionReason" text,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "UQ_49de7dde25d76b120677be9aedd" UNIQUE ("userId")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" varchar PRIMARY KEY NOT NULL,
        "userId" varchar NOT NULL,
        "tokenHash" varchar NOT NULL,
        "expiresAt" datetime NOT NULL,
        "revokedAt" datetime,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "UQ_c25bc63d248ca90e8dcc1d92d06" UNIQUE ("tokenHash")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_610102b60fea1455310ccd299d" ON "refresh_tokens" ("userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_610102b60fea1455310ccd299d"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "seller_profiles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
