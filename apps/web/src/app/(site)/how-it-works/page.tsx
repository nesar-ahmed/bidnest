import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { buyerFlow, guarantees, sellerFlow } from '@/lib/data';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'How bidding, anti-sniping, reserves, payment and delivery work on Bidnest.',
};

function FlowColumn({
  title,
  items,
  badge,
}: {
  title: string;
  items: { title: string; body: string }[];
  badge: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-gild-600 dark:text-gild-400/80">{badge}</p>
      <h2 className="mt-2 font-display text-3xl tracking-tight text-ink">{title}</h2>
      <ol className="mt-6 space-y-1">
        {items.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-xl p-3 transition hover:bg-wash">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line font-display text-sm italic text-gild-600 dark:text-gild-300">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-ink">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32">
        <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-6xl">
          A fair auction, from <em className="text-gild-600 dark:text-gild-300">listing to delivery</em>.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/60">
          Here is what happens at each step, for buyers and sellers.
        </p>
      </section>

      <section className="border-y border-line bg-panel/50">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-2">
          <FlowColumn badge="For buyers" title="Discover, bid, win, receive" items={buyerFlow} />
          <FlowColumn badge="For sellers" title="List, approve, close, payout" items={sellerFlow} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gild-600 dark:text-gild-400/80">
          Guarantees
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">What you can expect</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guarantees.map((g) => (
            <div key={g.title} className="rounded-2xl border border-line bg-panel p-6">
              <span className="text-gild-500 dark:text-gild-400">
                <Icon name="check" className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-medium text-ink">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="rounded-2xl border border-gild-400/25 bg-gild-400/[0.06] p-8 text-center sm:p-10">
          <h3 className="font-display text-2xl text-ink sm:text-3xl">Ready to buy or sell?</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink/60">
            Browse the lots that are live now, or list something of your own.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/auctions"
              className="rounded-full bg-gild-400 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-gild-300"
            >
              See live lots
            </Link>
            <Link
              href="/sell"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink/80 transition hover:border-gild-400/40"
            >
              Start selling
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
