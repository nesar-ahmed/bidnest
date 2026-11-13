import type { ReactNode } from 'react';
import { BuyerShell } from '@/components/dashboard/buyer-shell';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <BuyerShell>{children}</BuyerShell>;
}
