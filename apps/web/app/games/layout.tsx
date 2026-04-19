import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ink Game Hub — Classic games on Arc Suite',
  description: 'Play Hangman, Minesweeper, Snake, Tetris and more. Track your high scores. Part of Arc Suite.',
  openGraph: {
    title: 'Ink Game Hub',
    description: 'Classic browser games on Arc Suite.',
    url: 'https://arcsuite.xyz',
    siteName: 'Arc Suite',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
