import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Yourself — Science & Math Quiz on Arc Suite',
  description: 'Geometry, Math, Physics, Biology, Chemistry — 5 questions per round, earn points, unlock achievements.',
  openGraph: { title: 'Test Yourself', description: 'Science & Math Quiz on Arc Suite.', url: 'https://arcsuite.xyz', siteName: 'Arc Suite', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
