import type { ReactNode } from 'react';
import { UserRole } from '@bidnest/shared';
import { DashboardShell } from '@/components/dashboard/shell';

const items = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/approvals', label: 'Approvals', icon: 'file' },
  { href: '/admin/users', label: 'Users', icon: 'users' },
  { href: '/admin/categories', label: 'Categories', icon: 'folder' },
  { href: '/admin/orders', label: 'Orders', icon: 'box' },
  { href: '/admin/disputes', label: 'Disputes', icon: 'scale' },
  { href: '/admin/settings', label: 'Settings', icon: 'sliders' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell title="Control room" items={items} allow={[UserRole.Admin, UserRole.Moderator]}>
      {children}
    </DashboardShell>
  );
}
