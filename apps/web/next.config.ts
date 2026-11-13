import type { NextConfig } from 'next';

/**
 * The browser talks only to this app (/api/v1/...); Next proxies to the
 * NestJS API. Auth cookies therefore stay first-party — no CORS, and
 * httpOnly works in every browser without Secure/SameSite=None.
 */
const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The shared package ships plain TypeScript/JS - let Next transpile it if needed.
  transpilePackages: ['@bidnest/shared'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_INTERNAL_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
