'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icons';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  return 'light';
}

/**
 * The localStorage choice is applied by the init script in layout.tsx
 * before first paint, so read the DOM after hydration rather than state.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(readTheme()), []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
    localStorage.setItem('bidnest-theme', next);
    setTheme(next);
  };

  const shown = theme ?? 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={shown === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink/70 transition hover:border-gild-400/40 hover:text-gild-300"
    >
      <Icon name={shown === 'dark' ? 'sun' : 'moon'} className="h-[18px] w-[18px]" />
    </button>
  );
}
