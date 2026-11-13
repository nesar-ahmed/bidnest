import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Orders' };

export default function OrdersPage() {
  return (
    <Stub
      title="My orders"
      points={[
        'See how long you have left to pay for each order.',
        'Pay by card and download your receipts.',
        'Follow the shipping and confirm when it arrives.',
      ]}
    />
  );
}
