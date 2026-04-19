import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcSight — Community Insight Platform on Arc',
  description: 'Projects pay to ask. You earn points for answering. The community insight layer for Arc L1.',
  openGraph: { title: 'ArcSight — Community Insight Platform', description: 'Earn points for sharing your opinion on Arc L1.', url: 'https://arcsuite.xyz', siteName: 'Arc Suite', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
