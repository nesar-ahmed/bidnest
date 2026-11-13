import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'My bids' };

export default function MyBidsPage() {
  return (
    <Stub
      title="My bids"
      points={[
        'See which bids are winning and which ones have been outbid.',
        'Raise or lower your maximum without leaving the page.',
        'View your bid history for each lot.',
      ]}
    />
  );
}
