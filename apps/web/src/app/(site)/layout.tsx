import { SiteFooter } from '@/components/landing/footer';
import { SiteHeader } from '@/components/landing/header';

/**
 * Chrome for all public pages, including the buyer hub. Seller and admin
 * dashboards use DashboardShell inside their own route layouts.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
