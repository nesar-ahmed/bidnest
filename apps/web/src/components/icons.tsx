import type { ReactNode } from 'react';

const paths: Record<string, ReactNode> = {
  dashboard: (
    <>
      <path d="M3 3h7v7H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 14h7v7H3z" />
    </>
  ),
  gavel: <path d="M14 4l6 6-3 3-6-6 3-3zM11 8L4 15v5h5l7-7M12 21H4" />,
  box: <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" />,
  bell: <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 20a2 2 0 0 0 4 0" />,
  heart: (
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.75 2 5.55 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.55 22 8.75c0 3.53-3.4 6.61-8.55 11.32L12 21.35z" />
  ),
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21a7 7 0 0 1 14 0" />,
  users: (
    <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM16.5 12a3 3 0 1 0 0-6M2.5 20a6.5 6.5 0 0 1 13 0M16 20a6 6 0 0 1 5.5-4" />
  ),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
  folder: <path d="M3 6h6l2 2h10v11H3z" />,
  wallet: <path d="M3 8h18M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM17 13h.01" />,
  receipt: <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-3-2V5zM9 8h6M9 12h6" />,
  tag: <path d="M7 7h.01M14 4l6 6-9 9H5v-6l9-9z" />,
  scale: <path d="M12 3v18M5 21h14M8 6l-5 7h10L8 6zM16 6l-5 7h10l-5-7zM8 6l8-2" />,
  sliders: (
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M16 7a3 3 0 1 1 6 0 3 3 0 1 1-6 0M6 14a3 3 0 1 1 6 0 3 3 0 1 1-6 0" />
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  search: <path d="M20.5 20.5l-4.7-4.7M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.2M6.3 6.3A18 18 0 0 0 2 12s3.5 7 10 7a10.4 10.4 0 0 0 4.1-.8" />
  ),
  sun: (
    <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  check: <path d="M20 6L9 17l-5-5" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  file: <path d="M6 2h8l4 4v16H6zM14 2v4h4M9 12h6M9 16h6" />,
};

export function Icon({ name, className = 'h-4 w-4' }: { name: keyof typeof paths | string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name] ?? null}
    </svg>
  );
}
