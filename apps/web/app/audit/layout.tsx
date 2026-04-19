import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArcAudit — Web Security Scanner',
  description: 'Scan any website for security headers, HTTPS, and best practices. Get a security grade instantly.',
  openGraph: { title: 'ArcAudit — Security Scanner', description: 'Web security audit tool.', url: 'https://arcsuite.xyz', siteName: 'Arc Suite', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
