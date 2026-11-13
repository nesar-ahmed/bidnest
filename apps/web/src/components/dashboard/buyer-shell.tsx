'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../auth';
import { Icon } from '../icons';

const items = [
  { href: '/account', label: 'Overview', icon: 'dashboard' },
  { href: '/account/watchlist', label: 'Watchlist', icon: 'heart' },
  { href: '/account/bids', label: 'My bids', icon: 'gavel' },
  { href: '/account/orders', label: 'Orders', icon: 'box' },
  { href: '/account/notifications', label: 'Notifications', icon: 'bell' },
  { href: '/account/profile', label: 'Profile', icon: 'user' },
];

export function BuyerShell({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-5 pt-28">
        <p className="animate-pulse font-display text-xl text-ink/40">Opening your account…</p>
      </div>
    );
  }

  const firstName = user.name.split(' ')[0] ?? 'there';
  const isActive = (href: string) => pathname === href || (href !== '/account' && pathname.startsWith(`${href}/`));

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-gild-600 dark:text-gild-400/80">
            Buyer hub
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink">Welcome back, {firstName}.</h1>
          <p className="mt-2 text-sm text-ink/50">Your bids, watchlist and orders in one place.</p>
        </div>
        <Link
          href="/auctions"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink/75 transition hover:border-gild-400/40 hover:text-ink"
        >
          Browse auctions →
        </Link>
      </div>

      <nav className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-line" aria-label="Buyer account">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${
              isActive(item.href) ? 'border-gild-400 text-ink' : 'border-transparent text-ink/55 hover:text-ink'
            }`}
          >
            <Icon name={item.icon} className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
