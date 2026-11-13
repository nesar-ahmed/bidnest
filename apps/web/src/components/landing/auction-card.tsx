'use client';

import { useState } from 'react';
import { Countdown } from './countdown';
import { formatUsd, type LandingAuction } from '@/lib/data';

export function AuctionCard({ auction }: { auction: LandingAuction }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group relative rounded-2xl border border-line bg-panel p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-gild-400/30 hover:shadow-[0_24px_60px_-24px_var(--c-shadow)]">
      <div className={`relative flex h-44 items-center justify-center overflow-hidden rounded-xl ${auction.cover}`}>
        <span className="font-display text-6xl italic text-white/[0.14] transition-transform duration-500 group-hover:scale-110">
          {auction.monogram}
        </span>

        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] font-medium tracking-wide text-stone-200 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          LIVE
        </span>

        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
          onClick={() => setSaved((v) => !v)}
          className={`absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full border backdrop-blur transition ${
            saved
              ? 'border-gild-400/50 bg-gild-400/20 text-gild-300'
              : 'border-white/10 bg-black/40 text-stone-300 hover:text-gild-200'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.75 2 5.55 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.55 22 8.75c0 3.53-3.4 6.61-8.55 11.32L12 21.35z" />
          </svg>
        </button>
      </div>

      <div className="px-2 pb-1 pt-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gild-600 dark:text-gild-400/80">
          {auction.category}
        </p>
        <h3 className="mt-1.5 leading-snug text-ink">
          <a href="#" className="after:absolute after:inset-0 after:content-['']">
            {auction.title}
          </a>
        </h3>
        <p className="mt-1 text-xs text-ink/45">
          {auction.seller} · ★ {auction.sellerRating.toFixed(1)}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-ink/45">Current bid · {auction.bidCount} bids</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-ink">{formatUsd(auction.currentPriceCents)}</p>
            <p
              className={`mt-0.5 text-[11px] ${auction.reserveMet ? 'text-emerald-600 dark:text-emerald-400/80' : 'text-ink/45'}`}
            >
              {auction.reserveMet ? 'Reserve met' : 'Reserve not met'}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1.5 text-[11px] uppercase tracking-wider text-ink/45">Ends in</p>
            <Countdown endsInMs={auction.endsInMs} tone={auction.endsInMs < 3_600_000 ? 'urgent' : 'default'} />
          </div>
        </div>
      </div>
    </article>
  );
}
