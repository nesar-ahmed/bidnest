import type { ReactNode } from 'react';
import { Icon } from '../icons';

export function StatCard({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink/45">{label}</p>
        <span className="text-gild-500 dark:text-gild-400/70">
          <Icon name={icon} className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl tabular-nums text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-panel ${className}`}>
      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/70">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'bad';
}) {
  const tones = {
    neutral: 'border-line bg-wash text-ink/60',
    good: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warn: 'border-gild-500/40 bg-gild-400/10 text-gild-600 dark:text-gild-300',
    bad: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Stub({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-gild-400/25 bg-gild-400/10 text-gild-600 dark:text-gild-300">
        <Icon name="gavel" className="h-6 w-6" />
      </span>
      <h2 className="mt-6 font-display text-3xl tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm text-ink/50">This page is still being built. Here is what it will do:</p>
      <ul className="mt-8 space-y-2 text-left">
        {points.map((p) => (
          <li
            key={p}
            className="flex items-start gap-3 rounded-xl border border-line bg-panel px-4 py-3 text-sm text-ink/70"
          >
            <span className="mt-0.5 text-gild-500 dark:text-gild-400">
              <Icon name="check" className="h-4 w-4" />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
