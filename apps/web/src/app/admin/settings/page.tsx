import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Settings' };

export default function AdminSettingsPage() {
  return (
    <Stub
      title="Platform settings"
      points={[
        'Set commissions, Buy Now fees and payout options.',
        'Change bid increments, the anti-snipe window and payment deadlines.',
        'Edit banners, FAQs and email templates.',
      ]}
    />
  );
}
