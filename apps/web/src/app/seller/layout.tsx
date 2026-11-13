import type { ReactNode } from 'react';
import { UserRole } from '@bidnest/shared';
import { DashboardShell } from '@/components/dashboard/shell';

const items = [
  { href: '/seller', label: 'Dashboard', icon: 'dashboard' },
  { href: '/seller/listings', label: 'Listings', icon: 'tag' },
  { href: '/seller/sales', label: 'Sales', icon: 'receipt' },
  { href: '/seller/payouts', label: 'Payouts', icon: 'wallet' },
  { href: '/seller/onboarding', label: 'Verification', icon: 'shield' },
];

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell title="Seller hub" items={items} allow={[UserRole.Seller, UserRole.Admin]}>
      {children}
    </DashboardShell>
  );
}
