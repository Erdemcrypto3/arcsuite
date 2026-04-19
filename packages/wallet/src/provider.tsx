'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { walletConfig } from './config';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const arcTheme = darkTheme({
  accentColor: '#1434CB',
  accentColorForeground: 'white',
  borderRadius: 'medium',
});

// Arc brand: Protocol Navy background
arcTheme.colors.modalBackground = '#1B3158';
arcTheme.colors.profileForeground = '#0f1d35';

export function ArcWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={arcTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
