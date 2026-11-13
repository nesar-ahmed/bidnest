import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { apiRoot } from '../config/paths';
import { databaseFile } from './typeorm.config';

const initialValue = process.env.DATABASE_FILE;

afterEach(() => {
  if (initialValue === undefined) {
    delete process.env.DATABASE_FILE;
  } else {
    process.env.DATABASE_FILE = initialValue;
  }
});

describe('databaseFile', () => {
  it('defaults to bidnest.db inside apps/api', () => {
    delete process.env.DATABASE_FILE;

    expect(databaseFile()).toBe(join(apiRoot(), 'bidnest.db'));
  });

  it('resolves relative overrides against apps/api, not the working directory', () => {
    process.env.DATABASE_FILE = './tmp/other.sqlite';

    expect(databaseFile()).toBe(join(apiRoot(), 'tmp', 'other.sqlite'));
  });

  it('keeps absolute overrides unchanged', () => {
    process.env.DATABASE_FILE = '/var/lib/bidnest/prod.sqlite';

    expect(databaseFile()).toBe('/var/lib/bidnest/prod.sqlite');
  });

  it('passes :memory: through without turning it into a file path', () => {
    process.env.DATABASE_FILE = ':memory:';

    expect(databaseFile()).toBe(':memory:');
  });
});
