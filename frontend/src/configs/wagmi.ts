import { createConfig } from '@privy-io/wagmi';
import { http } from 'viem';
import { baseSepolia } from 'wagmi/chains';

export const TARGET_CHAIN = baseSepolia;

export const wagmiConfig = createConfig({
  chains: [TARGET_CHAIN],
  transports: {
    [TARGET_CHAIN.id]: http(),
  },
});
