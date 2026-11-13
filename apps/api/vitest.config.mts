import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

/**
 * Vitest is the default runner for new NestJS projects. SWC is required
 * because esbuild (Vite's default transform) does not emit
 * `design:paramtypes` metadata, which Nest's DI container relies on.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup.ts'],
    testTimeout: 15_000,
    hookTimeout: 15_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.module.ts',
        'src/**/*.spec.ts',
        'src/main.ts',
        'src/config/swagger.ts',
        'src/database/migrations/**',
        'src/database/seeds/**',
      ],
    },
  },
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
