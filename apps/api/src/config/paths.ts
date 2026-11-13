import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

// Walk up to the nearest package.json so this resolves the same from src/ (ts-node) and dist/ (build).
let cachedApiRoot: string | undefined;

export function apiRoot(): string {
  if (cachedApiRoot) return cachedApiRoot;

  let current = __dirname;
  for (;;) {
    if (existsSync(join(current, 'package.json'))) {
      cachedApiRoot = current;
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      throw new Error(`Could not locate the API package root (no package.json above ${__dirname}).`);
    }
    current = parent;
  }
}

export function resolveFromApiRoot(path: string): string {
  return isAbsolute(path) ? path : resolve(apiRoot(), path);
}
