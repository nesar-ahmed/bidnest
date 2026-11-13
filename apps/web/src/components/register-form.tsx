'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useAuth } from '@/components/auth';
import { PasswordField } from '@/components/password-field';
import { ApiError } from '@/lib/api';

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(name, email, password);
      // New accounts are always buyers.
      router.push('/account');
    } catch (e2) {
      setError(e2 instanceof ApiError ? e2.message : "Couldn't reach the server. Try again.");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-line bg-panel p-7 shadow-[0_44px_90px_-44px_var(--c-shadow)] sm:p-9">
        <h2 className="font-display text-3xl tracking-tight text-ink">Create an account</h2>

        <form className="mt-7 space-y-4" onSubmit={submit}>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Full name
            </label>
            <input
              id="name"
              required
              minLength={2}
              className="field"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="At least 10 characters"
            minLength={10}
            value={password}
            onChange={setPassword}
          />

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full rounded-full bg-gild-400 px-6 py-3 text-sm font-semibold text-stone-950 shadow-[0_0_36px_rgba(234,179,86,0.25)] transition hover:bg-gild-300 disabled:opacity-60"
          >
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/50">
          Already registered?{' '}
          <Link href="/login" className="font-medium text-gild-600 hover:underline dark:text-gild-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
