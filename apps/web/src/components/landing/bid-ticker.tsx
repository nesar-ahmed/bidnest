'use client';

import { useEffect, useState } from 'react';
import { bidFeed, formatUsd } from '@/lib/data';

/** Simulated feed; replace with the Socket.IO `bid:placed` room later. */
export function BidTicker() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % bidFeed.length), 3200);
    return () => clearInterval(id);
  }, []);

  const visible = [0, 1, 2].map((o) => bidFeed[(idx + o) % bidFeed.length]!);

  return (
    <ul className="space-y-1.5">
      {visible.map((b, i) => (
        <li
          key={`${idx}-${i}`}
          className={
            'flex items-baseline justify-between text-[13px] ' +
            (i === 0 ? 'animate-rise text-ink' : i === 1 ? 'text-ink/55' : 'text-ink/35')
          }
        >
          <span>
            {i === 0 && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gild-400 align-middle" />
            )}
            {b.name} bid
          </span>
          <span className="font-medium tabular-nums">{formatUsd(b.amountCents)}</span>
        </li>
      ))}
    </ul>
  );
}
