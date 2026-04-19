import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ink Wallet Dashboard — Activity summary for any address',
  description:
    'Enter any Arc wallet to see total transactions, gas spent, unique contracts interacted with, and active period.',
  openGraph: {
    title: 'Ink Wallet Dashboard',
    description: 'Wallet activity summary for Arc L1.',
    url: 'https://arcsuite.xyz',
    siteName: 'Arc Suite',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
