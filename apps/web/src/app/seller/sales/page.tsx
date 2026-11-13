import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Sales' };

export default function SalesPage() {
  return (
    <Stub
      title="Sales & shipping"
      points={[
        'See sold lots that still need shipping.',
        'Follow each order from payment to delivery.',
        'Download a CSV for your records.',
      ]}
    />
  );
}
