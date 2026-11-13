import type { Metadata } from 'next';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Sign in to your Bidnest account.',
};

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(234,179,86,0.14),transparent)] blur-2xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <LoginForm />
      </div>
    </section>
  );
}
