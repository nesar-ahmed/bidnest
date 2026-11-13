import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Categories' };

export default function AdminCategoriesPage() {
  return (
    <Stub
      title="Category management"
      points={[
        'Reorder, rename or merge categories without breaking old links.',
        'Set fees and photo rules for each category.',
        'Hide or show categories when you need to.',
      ]}
    />
  );
}
