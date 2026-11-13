import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { categories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Every department of the house, from fine watches to classic cars.',
};

const tints: Record<string, string> = {
  'fine-watches': 'from-[#3b3021] to-[#0b0a08]',
  'fine-art': 'from-[#1d2a36] to-[#090a08]',
  'rare-books': 'from-[#2f2438] to-[#0b0a08]',
  cameras: 'from-[#233038] to-[#0a0a08]',
  guitars: 'from-[#3a2a16] to-[#0b0a08]',
  jewellery: 'from-[#3d2330] to-[#0b0a08]',
  sneakers: 'from-[#3d1f1c] to-[#0b0a08]',
  vinyl: 'from-[#2c2c2f] to-[#0a0a08]',
  ceramics: 'from-[#33352a] to-[#0a0a08]',
  'classic-cars': 'from-[#1f3326] to-[#090b08]',
};

export default function CategoriesPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-gild-600 dark:text-gild-400/80">Categories</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
        Browse by <em className="text-gild-600 dark:text-gild-300">category</em>
      </h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/auctions?c=${c.slug}`}
            className="group overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 hover:-translate-y-1 hover:border-gild-400/30 hover:shadow-[0_24px_60px_-24px_var(--c-shadow)]"
          >
            <div
              className={`flex h-28 items-center justify-center bg-gradient-to-br ${tints[c.slug] ?? tints['fine-watches']}`}
            >
              <span className="text-white/60 transition-transform duration-500 group-hover:scale-110">
                <Icon name="folder" className="h-9 w-9" />
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <p className="text-sm font-medium text-ink">{c.name}</p>
              <p className="text-xs tabular-nums text-ink/45">{c.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
