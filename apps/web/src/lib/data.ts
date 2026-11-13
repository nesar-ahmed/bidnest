import { AuctionStatus, UserRole, type AuthUserDto } from '@bidnest/shared';

/**
 * Static content for the marketing pages and mock dashboard data. Auction
 * data is not wired to the API yet.
 *
 * Money rule (guide.md §8): all prices are integer cents.
 * Countdowns are offsets from page load so prerendered pages stay live.
 */

export interface NavLink {
  href: string;
  label: string;
}

const AUCTIONS_LINK: NavLink = { href: '/auctions', label: 'Live auctions' };

/**
 * Three important links per role. Category browsing lives on the auctions
 * page as a filter, so it does not need its own navbar item.
 */
export function navLinksForRole(role?: AuthUserDto['role'] | null): NavLink[] {
  switch (role) {
    case UserRole.Seller:
      return [AUCTIONS_LINK, { href: '/seller', label: 'Seller hub' }, { href: '/sell', label: 'Sell' }];
    case UserRole.Admin:
    case UserRole.Moderator:
      return [AUCTIONS_LINK, { href: '/admin', label: 'Admin' }, { href: '/admin/approvals', label: 'Approvals' }];
    default:
      return [AUCTIONS_LINK, { href: '/how-it-works', label: 'How it works' }, { href: '/sell', label: 'Sell' }];
  }
}

/**
 * Where a signed-in user lands. Role always comes from their profile,
 * never from anything picked at login (guide §3.1 RBAC).
 */
export function dashboardForRole(role: AuthUserDto['role']): string {
  switch (role) {
    case UserRole.Admin:
    case UserRole.Moderator:
      return '/admin';
    case UserRole.Seller:
      return '/seller';
    default:
      return '/account';
  }
}

export interface LandingAuction {
  id: string;
  title: string;
  category: string;
  seller: string;
  sellerRating: number;
  currentPriceCents: number;
  bidCount: number;
  reserveMet: boolean;
  status: AuctionStatus;
  endsInMs: number;
  /** Tailwind classes for the gradient cover art */
  cover: string;
  monogram: string;
}

const HOUR = 3_600_000;
const MIN = 60_000;

export const heroAuction: LandingAuction = {
  id: 'a-5711',
  title: 'Patek Philippe Nautilus 5711/1A — Steel, first series',
  category: 'Fine Watches',
  seller: 'Meridian Collectibles',
  sellerRating: 4.9,
  currentPriceCents: 84_500_00,
  bidCount: 38,
  reserveMet: true,
  status: AuctionStatus.Active,
  endsInMs: 2 * HOUR + 41 * MIN,
  cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#3b3021,#171310_55%,#0b0a08)]',
  monogram: 'N',
};

export const featuredAuctions: LandingAuction[] = [
  {
    id: 'a-strat',
    title: 'Fender Stratocaster “62 Reissue — Sunburst, Japan',
    category: 'Guitars',
    seller: 'Vintage Row Guitars',
    sellerRating: 4.8,
    currentPriceCents: 2_310_00,
    bidCount: 24,
    reserveMet: true,
    status: AuctionStatus.Active,
    endsInMs: 5 * HOUR + 12 * MIN,
    cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#3a2a16,#191207_55%,#0b0a08)]',
    monogram: 'S',
  },
  {
    id: 'a-leica',
    title: 'Leica M6 Classic body + 35mm Summicron-c',
    category: 'Cameras',
    seller: 'Klaus-Dieter W.',
    sellerRating: 5.0,
    currentPriceCents: 4_180_00,
    bidCount: 31,
    reserveMet: false,
    status: AuctionStatus.Active,
    endsInMs: 8 * HOUR + 45 * MIN,
    cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#233038,#0d1216_55%,#0a0a08)]',
    monogram: 'L',
  },
  {
    id: 'a-jordan',
    title: 'Air Jordan 1 “Chicago” — 1985 DS, B-grade box',
    category: 'Sneakers',
    seller: 'Archive Vault',
    sellerRating: 4.7,
    currentPriceCents: 12_750_00,
    bidCount: 57,
    reserveMet: true,
    status: AuctionStatus.Active,
    endsInMs: 1 * HOUR + 58 * MIN,
    cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#3d1f1c,#1c0d0b_55%,#0b0a08)]',
    monogram: 'J',
  },
  {
    id: 'a-moonjar',
    title: 'Moon Jar, hand-thrown porcelain — Joseon style',
    category: 'Ceramics',
    seller: 'Han-am Studio',
    sellerRating: 4.9,
    currentPriceCents: 6_900_00,
    bidCount: 19,
    reserveMet: true,
    status: AuctionStatus.Active,
    endsInMs: 11 * HOUR + 30 * MIN,
    cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#33352a,#141510_55%,#0a0a08)]',
    monogram: 'M',
  },
  {
    id: 'a-marquez',
    title: 'One Hundred Years of Solitude — first edition, 1967',
    category: 'Rare Books',
    seller: 'Souris Livres',
    sellerRating: 4.6,
    currentPriceCents: 9_600_00,
    bidCount: 12,
    reserveMet: false,
    status: AuctionStatus.Active,
    endsInMs: 16 * HOUR + 5 * MIN,
    cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#2f2438,#150f1a_55%,#0b0a08)]',
    monogram: 'C',
  },
  {
    id: 'a-datejust',
    title: 'Rolex Datejust 36 — fluted bezel, jubilee bracelet',
    category: 'Fine Watches',
    seller: 'Meridian Collectibles',
    sellerRating: 4.9,
    currentPriceCents: 11_200_00,
    bidCount: 44,
    reserveMet: true,
    status: AuctionStatus.Active,
    endsInMs: 3 * HOUR + 20 * MIN,
    cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#1f3326,#0c1610_55%,#090b08)]',
    monogram: 'R',
  },
];

export const endingSoonAuctions: LandingAuction[] = [
  { ...featuredAuctions[2]!, id: 'es-1', endsInMs: 24 * MIN },
  { ...heroAuction, id: 'es-2', endsInMs: 41 * MIN },
  { ...featuredAuctions[5]!, id: 'es-3', endsInMs: 63 * MIN },
  { ...featuredAuctions[0]!, id: 'es-4', endsInMs: 87 * MIN },
];

export const allAuctions: LandingAuction[] = [
  heroAuction,
  ...featuredAuctions,
  {
    id: 'a-nordic',
    title: 'Nordic Coast at Dusk — oil on canvas, attr. E. Dahl',
    category: 'Fine Art',
    seller: 'Galleri Norrsken',
    sellerRating: 4.8,
    currentPriceCents: 18_400_00,
    bidCount: 9,
    reserveMet: false,
    status: AuctionStatus.Active,
    endsInMs: 22 * HOUR + 10 * MIN,
    cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#1d2a36,#0d141c_55%,#090a08)]',
    monogram: 'E',
  },
  {
    id: 'a-dsotm',
    title: 'Pink Floyd — DSOTM, 1973 UK first press, AFoc',
    category: 'Vinyl',
    seller: 'Groove Merchant',
    sellerRating: 4.7,
    currentPriceCents: 2_600_00,
    bidCount: 19,
    reserveMet: true,
    status: AuctionStatus.Active,
    endsInMs: 4 * HOUR + 33 * MIN,
    cover: 'bg-[radial-gradient(130%_150%_at_18%_5%,#2c2c2f,#131315_55%,#0a0a08)]',
    monogram: 'P',
  },
];

export const categories: { name: string; slug: string; count: string }[] = [
  { name: 'Fine Watches', slug: 'fine-watches', count: '312 live' },
  { name: 'Fine Art', slug: 'fine-art', count: '188 live' },
  { name: 'Rare Books', slug: 'rare-books', count: '94 live' },
  { name: 'Cameras', slug: 'cameras', count: '143 live' },
  { name: 'Guitars', slug: 'guitars', count: '77 live' },
  { name: 'Jewellery', slug: 'jewellery', count: '201 live' },
  { name: 'Sneakers', slug: 'sneakers', count: '419 live' },
  { name: 'Vinyl', slug: 'vinyl', count: '130 live' },
  { name: 'Ceramics', slug: 'ceramics', count: '58 live' },
  { name: 'Classic Cars', slug: 'classic-cars', count: '23 live' },
];

export const stats = [
  { value: '$14.2M', label: 'paid out to sellers in 2025' },
  { value: '312k', label: 'members bidding weekly' },
  { value: '9.2k', label: 'verified sellers on platform' },
  { value: '4.9★', label: 'average buyer rating' },
];

export const howItWorks = [
  {
    step: '01',
    title: 'Every lot gets checked',
    body: 'Someone on our team reviews each listing before it goes live. If it looks counterfeit or breaks the rules, we reject it and tell the seller why.',
  },
  {
    step: '02',
    title: 'Bid your way',
    body: 'Bid yourself, or set a maximum and let us bid for you. Increments are fixed, and there are no surprise fees at checkout.',
  },
  {
    step: '03',
    title: 'The clock runs on our servers',
    body: 'A bid in the last few minutes adds time to the auction, so nobody wins by bidding at the last second.',
  },
  {
    step: '04',
    title: 'Pay, receive, then release',
    body: "Pay at checkout and follow the shipping. We release the seller's money after you confirm the item arrived.",
  },
];

export const testimonials = [
  {
    quote:
      'I won a 5711 for about 14% under market with nine seconds left. The extra time on the clock saved me, and the payout landed the same day.',
    name: 'Adaeze N.',
    role: 'Buyer · Lagos',
    rating: 5,
  },
  {
    quote:
      'I listed a box of old film cameras and got 41 bids in two days. Printed the label in the seller hub and that was it.',
    name: 'Henrik S.',
    role: 'Seller · Malmö',
    rating: 5,
  },
  {
    quote:
      'I stay because I trust the timer. It runs on their servers, every bid is logged, and a real person handles disputes.',
    name: 'Camila R.',
    role: 'Buyer · São Paulo',
    rating: 5,
  },
];

export const faqs = [
  {
    q: 'What is a proxy bid?',
    a: "You set the most you're willing to pay. We bid the smallest amount needed to keep you ahead, and we never go over your maximum.",
  },
  {
    q: 'How does anti-sniping work?',
    a: 'If someone bids in the final minutes, we add time to the clock. You cannot win a lot by bidding at the last second.',
  },
  {
    q: 'What does it cost?',
    a: 'Listing is free. Sellers pay 5% when a lot sells. Buyers pay the winning bid plus shipping.',
  },
  {
    q: 'Are items authenticated?',
    a: 'Sellers go through ID checks, listings are reviewed before they go live, and high-value categories need provenance documents. If something turns out to be fake, open a dispute.',
  },
  {
    q: 'What is a reserve price?',
    a: "The reserve is the lowest price the seller will accept. You can see whether it's been met, but not the amount.",
  },
  {
    q: 'How and when do sellers get paid?',
    a: "We hold the payment until you confirm delivery, or for 10 days if you don't. If there's a problem, open a dispute before the money is released.",
  },
];

export const bidFeed = [
  { name: 'Amara O.', amountCents: 84_500_00 },
  { name: 'Theo K.', amountCents: 83_900_00 },
  { name: 'J. Okafor', amountCents: 83_300_00 },
  { name: 'Miriam B.', amountCents: 82_600_00 },
  { name: 'Sofia L.', amountCents: 82_000_00 },
  { name: 'D. Whitfield', amountCents: 81_400_00 },
];

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export const buyerFlow = [
  {
    title: 'Discover',
    body: 'Browse by category or search. Use the filters on the auctions page to narrow things down.',
  },
  {
    title: 'Bid or delegate',
    body: 'Bid yourself, or set a maximum and let us bid for you. We only bid enough to keep you ahead.',
  },
  {
    title: 'Win and pay',
    body: 'The highest bid when the clock runs out wins. You have 48 hours to pay.',
  },
  {
    title: 'Receive and rate',
    body: 'Track the delivery, confirm it arrived, then rate the seller. We release the payment after that.',
  },
];

export const sellerFlow = [
  {
    title: 'List',
    body: 'Add photos, condition, a starting price and an optional reserve or Buy Now price. You can save a draft anytime.',
  },
  {
    title: 'Get approved',
    body: 'We review every listing, usually within one business day. If we reject it, we tell you why.',
  },
  {
    title: 'Watch it climb',
    body: "Bidding runs live, and late bids extend the clock. You can't edit a lot once bidding starts.",
  },
  {
    title: 'Ship and get paid',
    body: 'Print the label, add tracking, and get paid after the buyer confirms delivery. We take 5% only when a lot sells.',
  },
];

export const guarantees = [
  {
    title: 'Server-time timers',
    body: 'The end time is set and enforced by our servers, not your browser.',
  },
  {
    title: 'Anti-snipe fair close',
    body: "A bid in the final minutes adds time. You can't steal a lot at the last second.",
  },
  {
    title: 'Proxy bidding',
    body: 'Your maximum stays private. We only bid enough to keep you ahead.',
  },
  {
    title: 'Verified sellers',
    body: 'Sellers verify their ID and business details before they can list.',
  },
  {
    title: 'Buyer protection',
    body: "We hold the payment until delivery. If something's wrong, a person reviews the dispute.",
  },
  { title: 'Reserve transparency', body: 'The reserve amount is hidden, but you always see whether it has been met.' },
];

export const fees = [
  { label: 'Listing a lot', value: '$0' },
  { label: 'Commission on sold lots', value: '5%' },
  { label: 'Buy Now premium', value: '7%' },
  { label: 'Payout (standard)', value: 'After delivery' },
  { label: 'Payout (fast, optional)', value: '2% · 1 day' },
];
