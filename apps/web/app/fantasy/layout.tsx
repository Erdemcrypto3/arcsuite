import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ink Fantasy Premier League — Build your dream squad',
  description: 'Pick your 15-player Premier League squad with a £100M budget. Track points, manage transfers. Part of Arc Suite.',
  openGraph: {
    title: 'Ink Fantasy PL',
    description: 'Fantasy Premier League on Arc Suite.',
    url: 'https://arcsuite.xyz',
    siteName: 'Arc Suite',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
