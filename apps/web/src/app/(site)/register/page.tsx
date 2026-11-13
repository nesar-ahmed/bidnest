import type { Metadata } from 'next';
import { RegisterForm } from '@/components/register-form';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create a Bidnest account to bid, watch lots and sell.',
};

export default function RegisterPage() {
  return (
    <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(234,179,86,0.14),transparent)] blur-2xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <RegisterForm />
      </div>
    </section>
  );
}
