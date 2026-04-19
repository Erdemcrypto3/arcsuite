import { createPublicClient, defineChain, http } from 'viem';

export const arc = defineChain({
  id: 5042002,
  name: 'Arc',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
      webSocket: ['wss://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
});

export const arcPublicClient = createPublicClient({
  chain: arc,
  transport: http(),
});

export const CHAIN_ID = arc.id;
export const EXPLORER_URL = arc.blockExplorers.default.url;
export const BLOCKSCOUT_API_URL = 'https://testnet.arcscan.app/api';

// Native USDC contract (acts as both gas token and ERC-20).
// 6 decimals when used as ERC-20, 18 decimals when used as native gas unit.
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as const;
export const USDC_DECIMALS = 6;

// Other useful Arc testnet contracts (see Research/arc_chain_technical.md)
export const EURC_ADDRESS = '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a' as const;
export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3' as const;
export const FAUCET_URL = 'https://faucet.circle.com';

export type { PublicClient } from 'viem';
