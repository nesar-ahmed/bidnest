import type { Metadata } from 'next';
import Link from 'next/link';
import { Countdown } from '@/components/landing/countdown';
import { Badge, Panel, StatCard } from '@/components/dashboard/ui';
import { Greeting } from '@/components/dashboard/greeting';
import { formatUsd, heroAuction } from '@/lib/data';

export const metadata: Metadata = { title: 'Seller dashboard' };

const recentLots = [
  {
    title: 'Patek Philippe Nautilus 5711/1A',
    priceCents: heroAuction.currentPriceCents,
    bids: heroAuction.bidCount,
    endsInMs: heroAuction.endsInMs,
    status: 'Active' as const,
  },
  {
    title: 'Seiko Master Tonal 63 — walnut',
    priceCents: 1_640_00,
    bids: 11,
    endsInMs: 26 * 3_600_000,
    status: 'Pending review' as const,
  },
  {
    title: 'Minolta Hiromatic 7000 + service',
    priceCents: 420_00,
    bids: 8,
    endsInMs: 51 * 3_600_000,
    status: 'Scheduled' as const,
  },
  {
    title: 'Herman Miller Eames lounge (restored)',
    priceCents: 3_900_00,
    bids: 0,
    endsInMs: 0,
    status: 'Draft' as const,
  },
];

const statusTone = { Active: 'good', 'Pending review': 'warn', Scheduled: 'neutral', Draft: 'neutral' } as const;

export default function SellerDashboard() {
  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight text-ink">
        <Greeting tail="seller dashboard" />
      </h2>
      <p className="mt-1 text-sm text-ink/50">Your listings and sales at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active listings" value="9" hint="2 closing today" icon="tag" />
        <StatCard label="Sold this month" value="$12.4k" hint="11 lots" icon="receipt" />
        <StatCard label="Pending payout" value="$2.1k" hint="released after delivery" icon="wallet" />
        <StatCard label="Seller rating" value="4.9★" hint="from 143 sales" icon="user" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/seller/listings"
          className="rounded-full bg-gild-400 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-gild-300"
        >
          Create new listing
        </Link>
        <Link
          href="/seller/payouts"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink/75 transition hover:border-gild-400/40"
        >
          Review payouts
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Panel
          title="Your lots"
          action={
            <Link href="/seller/listings" className="text-xs font-medium text-gild-600 dark:text-gild-300">
              Manage all →
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {recentLots.map((l) => (
              <li
                key={l.title}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{l.title}</p>
                  <p className="mt-0.5 text-xs tabular-nums text-ink/45">
                    {formatUsd(l.priceCents)} · {l.bids} bids
                  </p>
                </div>
                {l.endsInMs > 0 && l.status === 'Active' && <Countdown endsInMs={l.endsInMs} />}
                <Badge tone={statusTone[l.status]}>{l.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="This week">
          <ul className="space-y-4 text-sm text-ink/70">
            <li className="flex items-start gap-3">
              <Badge tone="good">Sold</Badge>
              Marantz 2225 receiver, {formatUsd(940_00)}. Payment received.
            </li>
            <li className="flex items-start gap-3">
              <Badge tone="warn">Review</Badge>
              Seiko Master Tonal queued for listing approval
            </li>
            <li className="flex items-start gap-3">
              <Badge tone="neutral">Payout</Badge>
              $412 released to your bank after delivery confirmations
            </li>
            <li className="flex items-start gap-3">
              <Badge tone="neutral">Tip</Badge>
              Lots with 5 or more photos sell 2.4× more often. Add a few more angles to your draft.
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
