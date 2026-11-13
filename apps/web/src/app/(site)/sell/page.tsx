import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { fees, sellerFlow } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sell on Bidnest',
  description: 'List your item on Bidnest. Free to list, 5% only when it sells.',
};

export default function SellPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(234,179,86,0.14),transparent)] blur-2xl"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gild-600 dark:text-gild-400/80">
              Sell on Bidnest
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.02] tracking-tight text-ink sm:text-6xl">
              Sell it to people who <em className="text-gild-600 dark:text-gild-300">want it</em>.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/60">
              Listing is free. We review every lot, run the auction, and take 5% only when it sells. You just pack it
              well and ship it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-gild-400 px-6 py-3 text-sm font-semibold text-stone-950 shadow-[0_0_36px_rgba(234,179,86,0.3)] transition hover:-translate-y-0.5 hover:bg-gild-300"
              >
                Start selling
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink/80 transition hover:border-gild-400/40"
              >
                How it works
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-panel p-2.5 shadow-[0_44px_90px_-44px_var(--c-shadow)]">
            <div className="rounded-2xl bg-onyx px-6 py-5">
              <p className="font-display text-2xl text-stone-50">Fees</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">What you pay</p>
            </div>
            <ul className="divide-y divide-line px-6 py-2">
              {fees.map((f) => (
                <li key={f.label} className="flex items-center justify-between gap-6 py-4">
                  <span className="text-sm text-ink/65">{f.label}</span>
                  <span className="font-display text-xl tabular-nums text-ink">{f.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
            From listing to <em className="text-gild-600 dark:text-gild-300">payout</em>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sellerFlow.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-line bg-panel p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gild-400/15 text-gild-600 dark:text-gild-300">
                    <Icon
                      name={i === 0 ? 'file' : i === 1 ? 'shield' : i === 2 ? 'gavel' : 'box'}
                      className="h-4 w-4"
                    />
                  </span>
                  <span className="font-display text-sm italic text-ink/40">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 font-medium text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
