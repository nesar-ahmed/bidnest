import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/auth';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bidnest.app'),
  title: {
    default: 'Bidnest | Online auctions',
    template: '%s · Bidnest',
  },
  description:
    'An online auction house for watches, art, books, cars and collectables. Verified sellers and buyer protection on every lot.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0a08' },
    { media: '(prefers-color-scheme: light)', color: '#f7f5f1' },
  ],
};

/** Set the theme class before first paint so neither mode ever flashes. */
const themeInit = `(function(){try{var t=localStorage.getItem('bidnest-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}var e=document.documentElement;e.classList.toggle('dark',t==='dark');e.style.colorScheme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-canvas font-sans text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
