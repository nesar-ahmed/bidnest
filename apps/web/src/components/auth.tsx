'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import type { AuthUserDto } from '@bidnest/shared';

/**
 * Session state backed by the NestJS AuthModule — the browser holds
 * only httpOnly cookies (access + rotating refresh), this context just
 * mirrors GET /auth/me. Login/register here return the user so callers
 * can route by role via dashboardForRole().
 */

interface AuthContextValue {
  user: AuthUserDto | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUserDto>;
  register: (name: string, email: string, password: string) => Promise<AuthUserDto>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        login: async (email, password) => {
          const u = await api.login(email, password);
          setUser(u);
          return u;
        },
        register: async (name, email, password) => {
          const u = await api.register(name, email, password);
          setUser(u);
          return u;
        },
        signOut: async () => {
          await api.logout().catch(() => undefined);
          setUser(null);
        },
        refreshMe: async () => {
          setUser(await api.me().catch(() => null));
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
