import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Watchlist' };

export default function WatchlistPage() {
  return (
    <Stub
      title="My watchlist"
      points={[
        'See saved lots and what changed since your last visit.',
        'Get an alert when a lot is about to close.',
        'Keep the filters from the page where you saved the lot.',
      ]}
    />
  );
}
