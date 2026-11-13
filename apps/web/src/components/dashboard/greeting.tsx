'use client';

import { useAuth } from '../auth';

export function Greeting({ tail }: { tail: string }) {
  const { user } = useAuth();
  const first = user?.name.split(' ')[0] ?? 'there';
  return (
    <>
      Welcome back, <em className="text-gild-600 dark:text-gild-300">{first}</em>.
      <span className="sr-only"> {tail}</span>
    </>
  );
}
