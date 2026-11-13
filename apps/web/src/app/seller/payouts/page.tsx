import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Payouts' };

export default function PayoutsPage() {
  return (
    <Stub
      title="Payouts"
      points={[
        'See your balance, money on hold and past payouts.',
        'Check the commission and fees for each lot.',
        'Download invoices and receipts.',
      ]}
    />
  );
}
