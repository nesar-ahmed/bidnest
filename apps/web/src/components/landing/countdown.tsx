'use client';

import { useEffect, useState } from 'react';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Server-truth countdown. The end time is derived from page load
 * (offsetMs) client-side, so prerendered HTML never goes stale and
 * there is no hydration mismatch — digits only appear after mount.
 */
export function Countdown({ endsInMs, tone = 'default' }: { endsInMs: number; tone?: 'default' | 'urgent' }) {
  const [target, setTarget] = useState<number | null>(null);
  const [left, setLeft] = useState(endsInMs);

  useEffect(() => {
    setTarget(Date.now() + endsInMs);
  }, [endsInMs]);

  useEffect(() => {
    if (target === null) return;
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const box =
    'rounded-md border px-1.5 py-1 text-center tabular-nums ' +
    (tone === 'urgent'
      ? 'border-gild-500/40 bg-gild-400/15 text-gild-600 dark:text-gild-200'
      : 'border-line bg-wash text-ink');
  const sep = 'px-0.5 text-ink/30';

  if (target === null) {
    return (
      <div className="flex items-center gap-1 font-mono text-xs" aria-label="countdown starting">
        <span className={box}>--</span>
        <span className={sep}>:</span>
        <span className={box}>--</span>
        <span className={sep}>:</span>
        <span className={box}>--</span>
      </div>
    );
  }

  const totalSec = Math.floor(left / 1000);
  const d = Math.floor(totalSec / 86_400);
  const h = Math.floor((totalSec % 86_400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return (
    <div
      className="flex items-center gap-1 font-mono text-xs"
      role="timer"
      aria-label={`${d > 0 ? `${d} days, ` : ''}${h} hours ${m} minutes ${s} seconds remaining`}
    >
      {d > 0 && <span className={box}>{pad(d)}d</span>}
      <span className={box}>{pad(h)}</span>
      <span className={sep}>:</span>
      <span className={box}>{pad(m)}</span>
      <span className={sep}>:</span>
      <span className={box}>{pad(s)}</span>
    </div>
  );
}
