import {
  createPublicClient,
  createWalletClient,
  Hash,
  http,
  publicActions,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

export const viemClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: baseSepolia,
  transport: http(
    'https://base-sepolia.g.alchemy.com/v2/ct8MY7jn6rvI6mXf4ZPH7NV-nQjyyFLQ',
  ),
});

export const treasuryAccount = privateKeyToAccount(
  process.env.TREASURY_PRIVATE_KEY as Hash,
);

export const treasuryWalletClient = createWalletClient({
  name: 'Treasury Wallet',
  key: 'treasury-wallet',
  account: treasuryAccount,
  chain: baseSepolia,
  transport: http(
    'https://base-sepolia.g.alchemy.com/v2/ct8MY7jn6rvI6mXf4ZPH7NV-nQjyyFLQ',
  ),
}).extend(publicActions);
