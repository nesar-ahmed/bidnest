import type { Metadata } from 'next';
import Link from 'next/link';
import { AuctionCard } from '@/components/landing/auction-card';
import { Badge, Panel, StatCard } from '@/components/dashboard/ui';
import { featuredAuctions, formatUsd } from '@/lib/data';

export const metadata: Metadata = { title: 'My account' };

const myBids = [
  { lot: featuredAuctions[0]!, status: 'leading' as const },
  { lot: featuredAuctions[2]!, status: 'outbid' as const },
  { lot: featuredAuctions[5]!, status: 'winning' as const },
];

const notifications = [
  { text: 'You were outbid on the Fender Stratocaster', when: '4 min ago', unread: true },
  { text: 'You are the highest bidder on Rolex Datejust 36', when: '22 min ago', unread: true },
  { text: 'Order #4821 shipped. Tracking added.', when: 'Yesterday', unread: false },
];

export default function AccountDashboard() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active bids" value="12" hint="3 winning · 2 outbid" icon="gavel" />
        <StatCard label="Watchlist" value="26" hint="4 closing today" icon="heart" />
        <StatCard label="Orders" value="5" hint="1 awaiting payment" icon="box" />
        <StatCard label="Unread alerts" value="3" hint="outbid & shipping" icon="bell" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel
          title="Your live bids"
          action={
            <Link href="/account/bids" className="text-xs font-medium text-gild-600 dark:text-gild-300">
              View all →
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {myBids.map(({ lot, status }) => (
              <li key={lot.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{lot.title}</p>
                  <p className="mt-0.5 text-xs text-ink/45">
                    Your max {formatUsd(lot.currentPriceCents + 100_00)} · {lot.bidCount} bids
                  </p>
                </div>
                <Badge tone={status === 'outbid' ? 'bad' : status === 'winning' ? 'good' : 'warn'}>
                  {status === 'leading' ? 'Leading' : status === 'winning' ? 'Winning' : 'Outbid'}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Recent notifications"
          action={
            <Link href="/account/notifications" className="text-xs font-medium text-gild-600 dark:text-gild-300">
              Inbox →
            </Link>
          }
        >
          <ul className="space-y-3.5">
            {notifications.map((n) => (
              <li key={n.text} className="flex items-start gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-gild-400' : 'bg-line'}`}
                  aria-hidden
                />
                <div>
                  <p className={`text-sm leading-snug ${n.unread ? 'text-ink' : 'text-ink/60'}`}>{n.text}</p>
                  <p className="mt-0.5 text-xs text-ink/40">{n.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Lots you might like">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredAuctions.slice(3, 6).map((a) => (
              <AuctionCard key={a.id} auction={a} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
