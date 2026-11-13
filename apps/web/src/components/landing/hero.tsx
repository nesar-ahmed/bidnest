import Link from 'next/link';
import { BidTicker } from './bid-ticker';
import { Countdown } from './countdown';
import { formatUsd, heroAuction } from '@/lib/data';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[92vw] max-w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(234,179,86,0.16),transparent)] blur-2xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-ink/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gild-400" />
            1,284 lots open for bidding
          </p>

          <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Find something
            <br />
            <em className="text-gild-600 dark:text-gild-300">worth bidding on</em>.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">
            Bidnest is an online auction house for watches, art, books, cars and other collectables. Sellers are
            verified, every listing is checked, and the clock runs on our servers.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/auctions"
              className="rounded-full bg-gild-400 px-6 py-3 text-sm font-semibold text-stone-950 shadow-[0_0_36px_rgba(234,179,86,0.3)] transition hover:-translate-y-0.5 hover:bg-gild-300"
            >
              Browse auctions
            </Link>
            <Link
              href="/sell"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink/80 transition hover:-translate-y-0.5 hover:border-gild-400/40 hover:text-gild-600 dark:hover:text-gild-200"
            >
              Sell an item
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink/50">
            <span>
              <span className="text-gild-500 dark:text-gild-400">★★★★★</span> 4.9 · 12k buyers
            </span>
            <span className="hidden h-4 w-px bg-line sm:block" />
            <span>Buyer protection on every sale</span>
            <span className="hidden h-4 w-px bg-line sm:block" />
            <span>$14M+ paid to sellers</span>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_70%_20%,rgba(234,179,86,0.08),transparent)]"
          />
          <div className="relative rounded-3xl border border-line bg-panel/90 p-2.5 shadow-[0_44px_90px_-34px_var(--c-shadow)] backdrop-blur">
            <div
              className={`relative flex h-52 items-center justify-center overflow-hidden rounded-2xl sm:h-60 ${heroAuction.cover}`}
            >
              <span className="font-display text-8xl italic text-white/[0.13]">{heroAuction.monogram}</span>
              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] font-medium tracking-wide text-stone-200 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE · {heroAuction.bidCount} bids
              </span>
              <span className="absolute right-4 top-4 rounded-full border border-gild-400/40 bg-black/50 px-3 py-1.5 text-[11px] font-medium text-gild-200 backdrop-blur">
                Reserve met
              </span>
              <span className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] uppercase tracking-wider text-stone-300 backdrop-blur">
                {heroAuction.category}
              </span>
            </div>

            <div className="px-4 pb-2 pt-5">
              <h2 className="text-[15px] font-medium leading-snug text-ink">{heroAuction.title}</h2>
              <p className="mt-1 text-xs text-ink/50">
                {heroAuction.seller} · ★ {heroAuction.sellerRating.toFixed(1)} · verified seller
              </p>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink/50">Current bid</p>
                  <p className="mt-0.5 font-display text-4xl tabular-nums text-ink">
                    {formatUsd(heroAuction.currentPriceCents)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mb-1.5 text-[11px] uppercase tracking-wider text-ink/50">Closes in</p>
                  <Countdown endsInMs={heroAuction.endsInMs} tone="urgent" />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-line bg-wash p-3.5">
                <BidTicker />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
