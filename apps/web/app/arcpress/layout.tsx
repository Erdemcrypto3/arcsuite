import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcPress — Decentralized Blog on Arc',
  description: 'Publish articles as NFTs on Arc chain. Content stored on Walrus (decentralized storage). Fully on-chain blog platform.',
  openGraph: {
    title: 'ArcPress — Decentralized Blog on Arc',
    description: 'On-chain blog platform: publish, read, and collect articles as NFTs.',
    url: 'https://arcsuite.xyz',
    siteName: 'Arc Suite',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
