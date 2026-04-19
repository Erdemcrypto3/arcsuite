import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arc } from '@arcsuite/chain';

export const walletConfig = getDefaultConfig({
  appName: 'Arc Suite',
  projectId: '0', // WalletConnect projectId — works without one for injected wallets
  chains: [arc],
  ssr: false,
});
