import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcTip — On-chain Tips on Arc',
  description: 'Send ETH tips to any Arc wallet. Share your tip link. On-chain, transparent, no middleman.',
  openGraph: { title: 'ArcTip — Send Tips on Arc', description: 'On-chain tipping on Arc chain.', url: 'https://arcsuite.xyz', siteName: 'Arc Suite', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
