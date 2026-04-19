import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wallet Health — Check Approvals on Arc',
  description: 'Review token approvals granted by any Arc wallet. Spot risky contracts and revoke them via Revoke.cash.',
  openGraph: { title: 'Wallet Health — Arc Suite', description: 'Check wallet approvals on Arc chain.', url: 'https://arcsuite.xyz', siteName: 'Arc Suite', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
