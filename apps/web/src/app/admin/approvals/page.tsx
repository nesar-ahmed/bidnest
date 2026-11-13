import type { Metadata } from 'next';
import { Badge, Panel } from '@/components/dashboard/ui';
import { formatUsd, allAuctions } from '@/lib/data';

export const metadata: Metadata = { title: 'Listing approvals' };

// Review buttons are decorative until the approvals API exists.
const pending = allAuctions.slice(0, 5).map((a, i) => ({
  ...a,
  submitted: ['2 h', '5 h', '9 h', '1 d', '2 d'][i]!,
}));

export default function ApprovalsPage() {
  return (
    <Panel title="Pending review">
      <ul className="divide-y divide-line">
        {pending.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4 first:pt-0 last:pb-0">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${a.cover}`}>
              <span className="font-display text-xl italic text-white/30">{a.monogram}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{a.title}</p>
              <p className="mt-0.5 text-xs text-ink/45">
                {a.seller} · starts {formatUsd(a.currentPriceCents)} · submitted {a.submitted} ago
              </p>
            </div>
            <Badge tone="warn">Pending</Badge>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full bg-gild-400 px-4 py-1.5 text-xs font-semibold text-stone-950 transition hover:bg-gild-300"
              >
                Approve
              </button>
              <button
                type="button"
                className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink/60 transition hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400"
              >
                Reject with reason
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
