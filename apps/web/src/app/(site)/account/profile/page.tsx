import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Profile' };

export default function ProfilePage() {
  return (
    <Stub
      title="Profile & settings"
      points={[
        'Update your name, photo and password.',
        'Save your shipping and billing addresses.',
        "Apply for a seller account when you're ready.",
      ]}
    />
  );
}
