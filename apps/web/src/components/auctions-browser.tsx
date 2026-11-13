'use client';

import { useState } from 'react';
import { AuctionCard } from '@/components/landing/auction-card';
import { Icon } from '@/components/icons';
import { allAuctions, categories } from '@/lib/data';

type Sort = 'ending' | 'newest' | 'low' | 'high' | 'bids';

const sorts: { value: Sort; label: string }[] = [
  { value: 'ending', label: 'Ending soon' },
  { value: 'newest', label: 'Newest' },
  { value: 'low', label: 'Price · low to high' },
  { value: 'high', label: 'Price · high to low' },
  { value: 'bids', label: 'Most bids' },
];

export function AuctionsBrowser({ initialCategory }: { initialCategory: string }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(initialCategory);
  const [sort, setSort] = useState<Sort>('ending');

  const term = q.trim().toLowerCase();
  let list = allAuctions.filter(
    (a) =>
      (cat === 'all' || a.category.toLowerCase().replace(/\s+/g, '-') === cat) &&
      (!term || a.title.toLowerCase().includes(term) || a.seller.toLowerCase().includes(term)),
  );
  list = [...list].sort((a, b) => {
    switch (sort) {
      case 'low':
        return a.currentPriceCents - b.currentPriceCents;
      case 'high':
        return b.currentPriceCents - a.currentPriceCents;
      case 'bids':
        return b.bidCount - a.bidCount;
      case 'newest':
        return b.endsInMs - a.endsInMs;
      default:
        return a.endsInMs - b.endsInMs;
    }
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1 sm:max-w-xs">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40">
            <Icon name="search" />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles and sellers…"
            aria-label="Search auctions"
            className="field !pl-10"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort auctions"
          className="field !w-auto"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {[{ slug: 'all', name: 'All lots' }, ...categories].map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCat(c.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
              cat === c.slug
                ? 'border-gild-400/60 bg-gild-400/15 text-ink'
                : 'border-line text-ink/60 hover:border-gild-400/30 hover:text-ink'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink/45">
        {list.length} {list.length === 1 ? 'lot' : 'lots'} live
      </p>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="font-display text-2xl text-ink">No lots match that search.</p>
          <p className="mt-2 text-sm text-ink/50">Try a different search or category.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <AuctionCard key={a.id} auction={a} />
          ))}
        </div>
      )}
    </div>
  );
}
