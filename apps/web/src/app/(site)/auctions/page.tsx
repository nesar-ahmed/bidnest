import type { Metadata } from 'next';
import { AuctionsBrowser } from '@/components/auctions-browser';

export const metadata: Metadata = {
  title: 'Live auctions',
  description: 'Browse every lot open for bidding right now.',
};

type Search = { c?: string };

export default async function AuctionsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { c } = await searchParams;
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-gild-600 dark:text-gild-400/80">Live now</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
        Live <em className="text-gild-600 dark:text-gild-300">auctions</em>
      </h1>
      <p className="mt-3 max-w-xl text-ink/60">
        Every lot is reviewed before it goes live. Timers run on our servers, and late bids extend the clock.
      </p>
      <div className="mt-10">
        <AuctionsBrowser initialCategory={c ?? 'all'} />
      </div>
    </section>
  );
}
