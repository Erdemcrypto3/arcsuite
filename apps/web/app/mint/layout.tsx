import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcMint — AI NFT Generator on Arc',
  description: 'Generate AI art from a text prompt and mint it as an NFT on Arc chain. 0.5 USDC per mint.',
  openGraph: {
    title: 'ArcMint — AI NFT Generator',
    description: 'AI-powered NFT minting on Arc chain.',
    url: 'https://arcsuite.xyz',
    siteName: 'Arc Suite',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
