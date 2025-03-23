// require('dotenv').config();
// import { privateKeyToAccount } from 'viem/accounts';
// import {
//   Abi,
//   Address,
//   createPublicClient,
//   createWalletClient,
//   Hash,
//   http,
//   parseEther,
// } from 'viem';
// import { baseSepolia, sepolia } from 'viem/chains';
// import { readFileSync } from 'fs';
// import path from 'path';
// import axios from 'axios';
// const solc = require('solc');

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { Address } from 'viem';

const DigitalLibraryModule = buildModule('DigitalLibraryModule', (m) => {
  const privateKey = process.env.PRIVATE_KEY as Address | undefined;
  const treasuryWallet = process.env.TREASURY_WALLET_ADDRESS as
    | Address
    | undefined;

  if (!privateKey) {
    throw new Error('Private key not set in .env file');
  }

  if (!treasuryWallet) {
    throw new Error('Treasury wallet address not set in .env file');
  }
  const digitalLibrary = m.contract('DigitalLibrary', [treasuryWallet]);

  return { digitalLibrary };
});

export default DigitalLibraryModule;

// async function main() {
//   const privateKey = process.env.PRIVATE_KEY as Address | undefined;
//   const treasuryWallet = process.env.TREASURY_WALLET_ADDRESS as
//     | Address
//     | undefined;

//   if (!privateKey) {
//     throw new Error('Private key not set in .env file');
//   }

//   if (!treasuryWallet) {
//     throw new Error('Treasury wallet address not set in .env file');
//   }

//   const account = privateKeyToAccount(privateKey);

//   const publicClient = createPublicClient({
//     chain: baseSepolia,
//     transport: http(),
//   });

//   const walletClient = createWalletClient({
//     account,
//     chain: baseSepolia,
//     transport: http(),
//   });

//   const balance = await publicClient.getBalance({ address: account.address });
//   console.log('Deploying contracts with the account:', account.address);
//   console.log('Account balance:', balance);

//   const contractPath = path.join(__dirname, '../dist/DigitalLibrary.sol');
//   const contractSource = readFileSync(contractPath, 'utf8');

//   const { abi, bytecode } = await compileContract(contractSource);

//   const hash = await walletClient.deployContract({
//     abi,
//     bytecode,
//     args: [treasuryWallet],
//     account,
//   });
//   const receipt = await publicClient.waitForTransactionReceipt({ hash });
//   console.log('Contract deployed at address:', receipt.contractAddress);
//   console.log('DigitalLibrary contract deployment transaction hash:', hash);
// }

// async function compileContract(
//   source: string
// ): Promise<{ abi: Abi; bytecode: Hash }> {
//   const input = {
//     language: 'Solidity',
//     sources: {
//       'DigitalLibrary.sol': {
//         content: source,
//       },
//     },
//     settings: {
//       outputSelection: {
//         '*': {
//           '*': ['*'],
//         },
//       },
//     },
//   };

//   const output = JSON.parse(solc.compile(JSON.stringify(input)));

//   const contract = output.contracts['DigitalLibrary.sol']['DigitalLibrary'];
//   return {
//     abi: contract.abi,
//     bytecode: contract.evm.bytecode.object,
//   };
// }

// async function verifyContractOnScan(
//   contractAddress: Address,
//   treasuryWallet: Address,
//   contractSource: string
// ) {
//   const verificationData = {
//     codeformat: 'solidity-single-file',
//     sourceCode: contractSource,
//     constructorArguements: treasuryWallet,
//     contractaddress: contractAddress,
//     contractname: 'DigitalLibrary',
//     compilerversion: 'v0.8.20+commit.a1b79de6',
//     optimizationUsed: 1,
//     runs: 200,
//   };

//   const response = await axios.post(
//     'https://api-sepolia.basescan.org/api',
//     verificationData,
//     {
//       params: {
//         module: 'contract',
//         action: 'verifysourcecode',
//         apikey: process.env.BASESCAN_API_KEY,
//       },
//     }
//   );

//   console.log('Contract verification response:', response);

//   if (response.data.status === '1') {
//     console.log('Contract verification successful:', response.data.result);
//   } else {
//     console.error('Contract verification failed:', response.data.result);
//   }
// }

// const contractPath = path.join(__dirname, '../dist/DigitalLibrary.sol');
// const contractSource = readFileSync(contractPath, 'utf8');

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
