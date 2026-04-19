import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcChat — On-chain Messaging on Arc',
  description: 'Send wallet-to-wallet messages on Arc chain. Every message is a transaction. Permanent, verifiable, on-chain.',
  openGraph: { title: 'ArcChat — On-chain Messages', description: 'Wallet-to-wallet messaging on Arc.', url: 'https://arcsuite.xyz', siteName: 'Arc Suite', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
