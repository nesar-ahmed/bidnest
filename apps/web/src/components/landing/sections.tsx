import Link from 'next/link';
import { AuctionCard } from './auction-card';
import { Countdown } from './countdown';
import { Reveal } from './reveal';
import {
  categories,
  endingSoonAuctions,
  faqs,
  formatUsd,
  featuredAuctions,
  howItWorks,
  stats,
  testimonials,
} from '@/lib/data';

const wrap = 'mx-auto max-w-7xl px-5 sm:px-8';

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.22em] text-gild-600 dark:text-gild-400/80">{children}</p>
  );
}

export function CategoryMarquee() {
  const doubled = [...categories, ...categories];
  return (
    <section id="categories" aria-label="Categories" className="border-y border-line py-5">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee">
          {doubled.map((c, i) => (
            <Link
              key={`${c.slug}-${i}`}
              href={`/auctions?c=${c.slug}`}
              className="group mr-3 flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-panel px-4 py-2 text-sm text-ink/70 transition hover:border-gild-400/40 hover:text-gild-600 dark:hover:text-gild-200"
            >
              {c.name}
              <span className="rounded-full bg-wash px-2 py-0.5 text-[11px] tabular-nums text-ink/45 group-hover:bg-gild-400/15">
                {c.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedAuctions() {
  return (
    <section id="live" className={`${wrap} py-20 sm:py-28`}>
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Live now</Eyebrow>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">Today&apos;s finest lots</h2>
        </div>
        <Link
          href="/auctions"
          className="group text-sm text-ink/60 transition hover:text-gild-600 dark:hover:text-gild-200"
        >
          Browse all auctions <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredAuctions.map((a, i) => (
          <Reveal key={a.id} delay={(i % 3) * 90}>
            <AuctionCard auction={a} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function EndingSoon() {
  return (
    <section className={`${wrap} pb-20 sm:pb-28`}>
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Closing within the hour</Eyebrow>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">Endgame</h2>
        </div>
        <p className="text-sm text-ink/45">Clocks run on server time and extend if someone bids late.</p>
      </Reveal>

      <Reveal delay={100}>
        <div className="no-scrollbar -mx-5 mt-8 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          {endingSoonAuctions.map((a) => (
            <a
              key={a.id}
              href="#"
              className="group flex min-w-72 shrink-0 snap-start items-center gap-4 rounded-2xl border border-line bg-panel p-4 transition hover:border-gild-400/30 hover:bg-raised"
            >
              <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${a.cover}`}>
                <span className="font-display text-2xl italic text-white/25">{a.monogram}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                <p className="mt-0.5 text-xs tabular-nums text-ink/45">
                  {formatUsd(a.currentPriceCents)} · {a.bidCount} bids
                </p>
              </div>
              <Countdown endsInMs={a.endsInMs} tone="urgent" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function Stats() {
  return (
    <section className="relative border-y border-line bg-[radial-gradient(80%_140%_at_50%_0%,rgba(234,179,86,0.07),transparent)]">
      <div className={`${wrap} grid grid-cols-2 gap-x-6 gap-y-10 py-16 sm:py-20 lg:grid-cols-4`}>
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center lg:text-left">
            <p className="font-display text-5xl tabular-nums text-ink">{s.value}</p>
            <p className="mt-2 text-sm text-ink/50">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className={`${wrap} py-20 sm:py-28`}>
      <Reveal className="max-w-2xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          How an auction <em className="text-gild-600 dark:text-gild-300">runs here</em>.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/65">
          From the first listing to the final delivery, here is how we keep the process fair and easy to follow.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {howItWorks.map((s, i) => (
          <Reveal key={s.step} delay={i * 90}>
            <div className="group h-full rounded-2xl border border-line bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-gild-400/25">
              <p className="font-display text-4xl italic text-gild-500 dark:text-gild-400/60 transition group-hover:text-gild-600 dark:group-hover:text-gild-300">
                {s.step}
              </p>
              <h3 className="mt-4 font-medium text-ink">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/60">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150} className="mt-10">
        <Link
          href="/how-it-works"
          className="group inline-flex items-center gap-2 text-sm font-medium text-gild-600 transition hover:gap-3 dark:text-gild-300"
        >
          Read the full guide <span aria-hidden>→</span>
        </Link>
      </Reveal>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className={`${wrap} py-20 sm:py-24`}>
      <Reveal>
        <Eyebrow>From our buyers and sellers</Eyebrow>
        <h2 className="mt-3 max-w-xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
          What buyers and sellers say.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 90}>
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-panel p-6">
              <div>
                <p className="text-gild-500 dark:text-gild-400" aria-label={`${t.rating} out of 5 stars`}>
                  {'★'.repeat(t.rating)}
                  <span className="text-ink/15">{'★'.repeat(5 - t.rating)}</span>
                </p>
                <blockquote className="mt-4 font-display text-lg italic leading-snug text-ink/85">
                  “{t.quote}”
                </blockquote>
              </div>
              <figcaption className="mt-6 text-sm text-ink/45">
                <span className="font-medium text-ink/75">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className={`${wrap} py-20 sm:py-24`}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Common
            <br />
            <em className="text-gild-600 dark:text-gild-300">questions</em>.
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-ink/60">
            Can&apos;t find your answer? Email us and we&apos;ll reply within one business day.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] font-medium text-ink/85 transition hover:text-gild-600 dark:hover:text-gild-200 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-sm text-ink/50 transition group-open:rotate-45 group-open:border-gild-400/50 group-open:text-gild-600 dark:group-open:text-gild-300">
                    +
                  </span>
                </summary>
                <p className="max-w-xl pb-6 text-sm leading-relaxed text-ink/60">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Stays dark in both themes — reads as "black lacquer". */
export function SellerCta() {
  const points = [
    'Free to list. We take 5% only when a lot sells.',
    'A seller hub for scheduling, photos and shipping labels.',
    'Payouts released after the buyer confirms delivery.',
  ];
  return (
    <section id="sell" className={`${wrap} py-20 sm:py-28`}>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-gild-400/20 bg-onyx px-8 py-14 sm:px-14 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(234,179,86,0.18),transparent)] blur-xl"
          />
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-gild-300/80">For sellers</p>
              <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-stone-50 sm:text-5xl">
                Have something <em className="text-gild-300">worth selling</em>?
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-stone-400">
                List it in a few minutes. We review every lot before it goes live, so buyers know what they are bidding
                on.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/sell"
                  className="rounded-full bg-gild-400 px-6 py-3 text-sm font-semibold text-stone-950 shadow-[0_0_36px_rgba(234,179,86,0.3)] transition hover:-translate-y-0.5 hover:bg-gild-300"
                >
                  Start selling
                </Link>
                <Link
                  href="/sell"
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-stone-200 transition hover:border-gild-400/40 hover:text-gild-200"
                >
                  See fees
                </Link>
              </div>
            </div>

            <ul className="space-y-5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-4 border-l border-gild-400/25 pl-5">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-5 w-5 shrink-0 text-gild-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <p className="text-[15px] leading-relaxed text-stone-300">{p}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
