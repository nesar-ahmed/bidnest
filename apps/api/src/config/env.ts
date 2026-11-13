import { join } from 'node:path';
import { config } from 'dotenv';
import { apiRoot } from './paths';

// Absolute path: dotenv's default cwd lookup misses the file when started from the repo root.
config({ path: join(apiRoot(), '.env') });
