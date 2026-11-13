import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Listings' };

export default function ListingsPage() {
  return (
    <Stub
      title="Listing manager"
      points={[
        'Add photos, set the condition and price, then choose when the lot goes live.',
        'Track each listing from draft to live.',
        'Save drafts and see why a listing was rejected.',
      ]}
    />
  );
}
