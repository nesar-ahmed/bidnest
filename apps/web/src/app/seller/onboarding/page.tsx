import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Verification' };

export default function OnboardingPage() {
  return (
    <Stub
      title="Seller verification"
      points={[
        'Send your business details and ID for review.',
        'Track your verification status.',
        'Add the bank account where payouts should go.',
      ]}
    />
  );
}
