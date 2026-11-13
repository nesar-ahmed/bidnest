import Link from 'next/link';

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Live auctions', href: '/auctions' },
      { label: 'Categories', href: '/categories' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Watchlist', href: '/account/watchlist' },
    ],
  },
  {
    title: 'Selling',
    links: [
      { label: 'Start a listing', href: '/sell' },
      { label: 'Seller hub', href: '/seller' },
      { label: 'Fees & payouts', href: '/sell' },
      { label: 'Verification', href: '/seller' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/how-it-works' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Trust & safety', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-panel/60">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="font-display text-3xl text-ink">
              Bidnest<span className="text-gild-400">.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/50">
              An online auction house for things worth keeping. Every seller is verified and every lot is reviewed
              before it goes live.
            </p>
            <div className="mt-6 flex gap-3">
              {['X', 'IG', 'YT'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={`Bidnest on ${s}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-[11px] font-semibold text-ink/50 transition hover:border-gild-400/40 hover:text-gild-600 dark:hover:text-gild-300"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-ink/60 transition hover:text-gild-600 dark:hover:text-gild-200"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 text-xs text-ink/40">
          <p>© 2026 Bidnest Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="transition hover:text-ink/70">
              Privacy
            </a>
            <a href="#" className="transition hover:text-ink/70">
              Terms
            </a>
            <a href="#" className="transition hover:text-ink/70">
              Cookies
            </a>
            <a href="#top" className="text-ink/50 transition hover:text-gild-600 dark:hover:text-gild-300">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
