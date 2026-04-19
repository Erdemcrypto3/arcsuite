import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcPoll — On-chain Polls on Arc',
  description: 'Create and vote on polls recorded on Arc chain. Every vote is a transaction. Transparent, verifiable, on-chain.',
  openGraph: { title: 'ArcPoll — On-chain Polls', description: 'On-chain polling on Arc chain.', url: 'https://arcsuite.xyz', siteName: 'Arc Suite', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
