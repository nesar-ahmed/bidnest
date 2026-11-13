import type { AuthUserDto, SellerApplicationRequestDto, SellerApplicationResponseDto } from '@bidnest/shared';

/**
 * Thin typed fetch client for the NestJS API, reached through the
 * Next /api proxy so httpOnly cookies are first-party.
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE = '/api/v1';

const NO_REFRESH_PATHS = new Set(['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']);
let refreshInFlight: Promise<boolean> | null = null;

// The access token lasts 15 minutes; the refresh cookie lasts 7 days.
// Share one refresh attempt across concurrent 401s so we do not rotate twice.
function refreshSession(): Promise<boolean> {
  refreshInFlight ??= fetch(`${BASE}/auth/refresh`, { method: 'POST', credentials: 'same-origin' })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    credentials: 'same-origin',
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
}

async function call<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  let res = await request(path, init);

  if (res.status === 401 && retry && !NO_REFRESH_PATHS.has(path) && (await refreshSession())) {
    res = await request(path, init);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON error bodies (e.g. proxy HTML) leave `data` null.
  }

  if (!res.ok) {
    const d = data as { code?: string; message?: string | string[] } | null;
    const message = Array.isArray(d?.message) ? d.message.join(', ') : (d?.message ?? `Request failed (${res.status})`);
    throw new ApiError(res.status, message, d?.code);
  }
  return data as T;
}

export const api = {
  /** Current session user, or null when signed out / expired. */
  async me(): Promise<AuthUserDto | null> {
    try {
      return await call<AuthUserDto>('/auth/me');
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return null;
      throw e;
    }
  },

  login: (email: string, password: string) =>
    call<AuthUserDto>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name: string, email: string, password: string) =>
    call<AuthUserDto>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  logout: () => call<void>('/auth/logout', { method: 'POST' }),

  /** Apply to sell — person or business; role flips to Seller only after admin approval. */
  applyAsSeller: (input: SellerApplicationRequestDto) =>
    call<SellerApplicationResponseDto>('/users/me/seller-application', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
};
