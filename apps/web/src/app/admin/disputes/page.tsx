import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Disputes' };

export default function AdminDisputesPage() {
  return (
    <Stub
      title="Disputes & reports"
      points={[
        'Read the buyer, seller and moderator messages in one thread.',
        'Refund, release payment, warn or ban, with an audit trail.',
        'Review reported listings and users.',
      ]}
    />
  );
}
