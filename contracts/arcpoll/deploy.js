/**
 * ArcPoll Deploy Script (Arc testnet, chainId 5042002)
 *
 * Usage:
 *   1. Compile ArcPoll.sol with Foundry/Hardhat/Remix and paste bytecode below
 *   2. Set DEPLOY_KEY env var with deployer private key (USDC for gas required)
 *   3. node deploy.js
 *
 * Prerequisites:
 *   npm install viem
 */

const { createWalletClient, createPublicClient, http, defineChain } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

// Arc testnet chain
const arc = defineChain({
  id: 5042002,
  name: 'Arc',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
});

// Constructor parameters
// Native USDC on Arc (acts as ERC-20 with 6 decimals AND as gas token)
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
const TREASURY_ADDRESS = '0x9e84d77264d94c646df91a70dbae99c20330ead0';

// Contract bytecode — paste from Foundry/Remix compilation
const BYTECODE = 'PASTE_COMPILED_BYTECODE_HERE';

async function deploy() {
  const privateKey = process.env.DEPLOY_KEY;
  if (!privateKey) {
    console.error('Set DEPLOY_KEY environment variable');
    process.exit(1);
  }

  const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`);
  console.log('Deploying from:', account.address);

  const walletClient = createWalletClient({ account, chain: arc, transport: http() });
  const publicClient = createPublicClient({ chain: arc, transport: http() });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log('Balance:', Number(balance) / 1e18, 'USDC (native gas)');

  if (balance === 0n) {
    console.error('No USDC for gas! Get test USDC from https://faucet.circle.com');
    process.exit(1);
  }

  // Encode constructor args: (address _paymentToken, address _treasury)
  const encodedArgs =
    USDC_ADDRESS.slice(2).padStart(64, '0') +
    TREASURY_ADDRESS.slice(2).padStart(64, '0');

  const deployData = `0x${BYTECODE}${encodedArgs}`;

  console.log('Deploying ArcPoll...');
  console.log('  Payment token (USDC):', USDC_ADDRESS);
  console.log('  Treasury:', TREASURY_ADDRESS);

  const hash = await walletClient.sendTransaction({ data: deployData });

  console.log('Tx hash:', hash);
  console.log('Waiting for confirmation...');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Contract deployed at:', receipt.contractAddress);
  console.log('Explorer:', `https://testnet.arcscan.app/address/${receipt.contractAddress}`);
  console.log('Gas used:', receipt.gasUsed.toString());
  console.log('\nDone! Update ARCPOLL_ADDRESS in poll module contract.ts with:', receipt.contractAddress);
}

deploy().catch(console.error);
