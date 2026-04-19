import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcFlow — Bridge & DEX Analytics on Arc',
  description: 'Track bridge inflows/outflows and DEX trading activity on Arc chain. Unique wallets, volume, top tokens.',
  openGraph: { title: 'ArcFlow — Arc Analytics', description: 'Bridge and DEX analytics for Arc chain.', url: 'https://arcsuite.xyz', siteName: 'Arc Suite', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
