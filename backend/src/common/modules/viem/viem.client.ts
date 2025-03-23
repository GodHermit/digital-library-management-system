import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

export const viemClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    'https://base-sepolia.g.alchemy.com/v2/ct8MY7jn6rvI6mXf4ZPH7NV-nQjyyFLQ',
  ),
});
