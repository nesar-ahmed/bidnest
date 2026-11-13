import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Panel, StatCard } from '@/components/dashboard/ui';
import { Greeting } from '@/components/dashboard/greeting';
import { formatUsd } from '@/lib/data';

export const metadata: Metadata = { title: 'Admin dashboard' };

const queue = [
  {
    title: 'Patek Philippe Calatrava 5522 — platinum',
    seller: 'Meridian Collectibles',
    priceCents: 62_000_00,
    age: '2 h',
  },
  {
    title: 'Basquiat screenprint, signed edition 14/250',
    seller: 'Galleri Norrsken',
    priceCents: 9_800_00,
    age: '5 h',
  },
  {
    title: 'Fender Telecaster “72 — sunburst, original finish',
    seller: 'Vintage Row Guitars',
    priceCents: 3_100_00,
    age: '9 h',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight text-ink">
        <Greeting tail="admin control room" />
      </h2>
      <p className="mt-1 text-sm text-ink/50">Platform health at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value="312,481" hint="+1,204 this week" icon="users" />
        <StatCard label="Active auctions" value="1,284" hint="14 closing within hour" icon="gavel" />
        <StatCard label="GMV (30 days)" value="$841k" hint="+6.2% vs last month" icon="chart" />
        <StatCard label="Commission (30 days)" value="$41.2k" hint="5% blended" icon="wallet" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Panel
          title="Listing approval queue"
          action={
            <Link href="/admin/approvals" className="text-xs font-medium text-gild-600 dark:text-gild-300">
              Open queue →
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {queue.map((q) => (
              <li
                key={q.title}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{q.title}</p>
                  <p className="mt-0.5 text-xs text-ink/45">
                    {q.seller} · starts {formatUsd(q.priceCents)} · submitted {q.age} ago
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-gild-400 px-3.5 py-1.5 text-xs font-semibold text-stone-950 transition hover:bg-gild-300"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink/60 transition hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel title="Needs attention">
            <ul className="space-y-3.5 text-sm">
              <li className="flex justify-between gap-3">
                <span className="text-ink/70">Seller verifications pending</span> <Badge tone="warn">18</Badge>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-ink/70">Open disputes</span> <Badge tone="bad">5</Badge>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-ink/70">Reports flagged</span> <Badge tone="bad">3</Badge>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-ink/70">Unpaid orders near deadline</span> <Badge tone="warn">7</Badge>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-ink/70">Payout holds</span> <Badge tone="neutral">$18.3k</Badge>
              </li>
            </ul>
          </Panel>
          <Panel title="Commission, last 12 weeks">
            <div className="flex h-16 items-end gap-1" aria-hidden>
              {[38, 44, 40, 52, 48, 61, 55, 67, 62, 74, 70, 84].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm bg-gild-400/25" style={{ height: `${v}%` }} />
              ))}
            </div>
            <p className="mt-3 text-xs text-ink/45">Weekly totals</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
