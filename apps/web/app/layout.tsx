import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ArcWalletProvider } from '@arcsuite/wallet/provider';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: "Arc Suite — Mini Utilities for Circle's Arc L1",
  description:
    "A portfolio of mini utilities for users and developers building on Circle's Arc L1.",
  openGraph: {
    title: 'Arc Suite',
    description: "Mini utilities for Circle's Arc L1.",
    url: 'https://arcsuite.xyz',
    siteName: 'Arc Suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arc Suite',
    description: "Mini utilities for Circle's Arc L1.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <ArcWalletProvider>{children}</ArcWalletProvider>
      </body>
    </html>
  );
}
