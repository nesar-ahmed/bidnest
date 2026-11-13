'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from './auth';
import { Icon } from './icons';
import { dashboardForRole } from '@/lib/data';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const logout = () => {
    setOpen(false);
    void signOut().then(() => router.push('/'));
  };

  return (
    <div className="relative">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setOpen(false)}
        />
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full border border-line py-1 pl-1 pr-3 transition hover:border-gild-400/40"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gild-400 text-[11px] font-bold text-stone-950">
          {initials}
        </span>
        <span className="hidden max-w-28 truncate text-sm text-ink/80 sm:block">{user.name}</span>
        <Icon name="chevron-down" className={`h-3.5 w-3.5 text-ink/50 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-panel shadow-xl shadow-black/10">
          <Link
            href="/account/profile"
            onClick={() => setOpen(false)}
            className="block border-b border-line px-4 py-3 transition hover:bg-wash"
          >
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="mt-0.5 truncate text-xs text-ink/50">{user.email}</p>
          </Link>
          <nav className="p-1.5">
            <Link
              href={dashboardForRole(user.role)}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/80 transition hover:bg-wash hover:text-ink"
            >
              <Icon name="dashboard" /> Dashboard
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/80 transition hover:bg-wash hover:text-ink"
            >
              <Icon name="logout" /> Log out
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
