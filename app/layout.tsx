import type { Metadata } from 'next';
import { DM_Serif_Display, Figtree } from 'next/font/google';
import './globals.css';

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'MIRA — Mock Interview and Response Analyzer',
  description: 'AI-powered mock interview practice platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSerifDisplay.variable} ${figtree.variable}`}>{children}</body>
    </html>
  );
}
