import type { Metadata } from 'next';
import { Stub } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Notifications' };

export default function NotificationsPage() {
  return (
    <Stub
      title="Notifications"
      points={[
        'See outbid alerts, ending-soon reminders, shipping updates and more.',
        'Mark messages as read, synced with the bell in the header.',
        'Choose which alerts you get by email or in the app.',
      ]}
    />
  );
}
