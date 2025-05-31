import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';

require('@nomicfoundation/hardhat-verify');
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY!,
    },
    customChains: [
      {
        chainId: 84532,
        network: 'baseSepolia',
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
    ],
  },
  networks: {
    baseSepolia: {
      chainId: 84532,
      url: 'https://base-sepolia.drpc.org', // Replace with the actual Base Sepolia RPC URL
      accounts: [process.env.PRIVATE_KEY].filter((k) => !!k) as string[],
    },
  },
};

export default config;
