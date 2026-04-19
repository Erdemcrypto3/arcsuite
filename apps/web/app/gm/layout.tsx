import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GM Widget — Say gm on Arc',
  description: 'Send a daily on-chain gm transaction on Arc. Track your streak and climb the calendar. Part of Arc Suite.',
  openGraph: {
    title: 'GM Widget — Arc Suite',
    description: 'Daily on-chain gm with streak tracking on Arc.',
    url: 'https://arcsuite.xyz',
    siteName: 'Arc Suite',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
