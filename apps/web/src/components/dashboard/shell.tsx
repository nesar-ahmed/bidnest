'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { UserRole } from '@bidnest/shared';
import { useAuth } from '../auth';
import { Icon } from '../icons';
import { ThemeToggle } from '../theme-toggle';
import { UserMenu } from '../user-menu';
import { dashboardForRole } from '@/lib/data';

export interface ShellItem {
  href: string;
  label: string;
  icon: string;
}

const roleLabel: Record<UserRole, string> = {
  [UserRole.Buyer]: 'Buyer',
  [UserRole.Seller]: 'Seller',
  [UserRole.Admin]: 'Admin',
  [UserRole.Moderator]: 'Moderator',
};

/**
 * Shared chrome for /account, /seller and /admin.
 * Default prefix page = dashboard (items[0]); every sub-page lives under
 * the role prefix. Guards: guests → /login; a signed-in user without one
 * of the `allow`ed roles is bounced to their own dashboard.
 */
export function DashboardShell({
  title,
  items,
  allow,
  children,
}: {
  title: string;
  items: ShellItem[];
  /** Roles permitted here; omit = any signed-in user. */
  allow?: UserRole[];
  children: ReactNode;
}) {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  useEffect(() => {
    if (ready && user && allow && !allow.includes(user.role)) {
      router.replace(dashboardForRole(user.role));
    }
  }, [ready, user, allow, router]);

  useEffect(() => setMenuOpen(false), [pathname]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="animate-pulse font-display text-xl text-ink/40">Opening your dashboard…</p>
      </div>
    );
  }

  const isActive = (href: string) => pathname === href || (href !== items[0]!.href && pathname.startsWith(`${href}/`));
  const active = items.find((i) => isActive(i.href)) ?? items[0]!;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-5 pt-6">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          Bidnest<span className="text-gild-400">.</span>
        </Link>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gild-600 dark:text-gild-400/80">
          {roleLabel[user.role]} · {title}
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label={`${title} sections`}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
              isActive(item.href) ? 'bg-gild-400/12 font-medium text-ink' : 'text-ink/60 hover:bg-wash hover:text-ink'
            }`}
          >
            <Icon
              name={item.icon}
              className={`h-[18px] w-[18px] ${isActive(item.href) ? 'text-gild-500 dark:text-gild-400' : ''}`}
            />
            {item.label}
            {isActive(item.href) && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gild-400" />}
          </Link>
        ))}
      </nav>

      <div className="border-t border-line px-6 py-4 text-xs text-ink/40">Signed in as {user.name}</div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-panel/60 backdrop-blur lg:block">
        {sidebar}
      </aside>
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-panel lg:hidden">{sidebar}</aside>
        </>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-5 sm:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink/70 lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <h1 className="truncate text-sm font-semibold uppercase tracking-[0.16em] text-ink/70">{active.label}</h1>
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
