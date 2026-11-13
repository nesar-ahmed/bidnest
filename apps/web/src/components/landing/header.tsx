'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { Icon } from '../icons';
import { ThemeToggle } from '../theme-toggle';
import { UserMenu } from '../user-menu';
import { navLinksForRole } from '@/lib/data';

export function SiteHeader() {
  const { user, ready } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = navLinksForRole(user?.role);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-line bg-canvas/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-2xl leading-none tracking-tight text-ink">
          Bidnest<span className="text-gild-400">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink/60 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {ready && !user && (
            <Link
              href="/login"
              className="rounded-full bg-gild-400 px-4 py-2 text-sm font-semibold text-stone-950 shadow-[0_0_24px_rgba(234,179,86,0.25)] transition hover:bg-gild-300"
            >
              Log in
            </Link>
          )}
          {ready && user && <UserMenu />}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink/70 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line px-5 py-4 md:hidden" aria-label="Mobile">
          <div className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-ink/70 transition hover:bg-wash hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
            {ready && !user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-gild-400 px-4 py-2 text-center text-sm font-semibold text-stone-950"
                >
                  Log in
                </Link>
                <span className="py-1">
                  <ThemeToggle />
                </span>
              </>
            ) : (
              <span className="py-1">
                <UserMenu />
              </span>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
