import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Orders' };

export default function AdminOrdersPage() {
  return (
    <Stub
      title="Orders & payments"
      points={[
        'Filter orders by status, payment deadline or payout hold.',
        'Issue refunds and keep a record of each one.',
        'Export reports for orders, revenue and unpaid lots.',
      ]}
    />
  );
}
