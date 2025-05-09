import { ethers } from 'ethers';
import dotenv from 'dotenv';
import logger from '../../config/logger';

dotenv.config();

if (!process.env.AVALANCHE_RPC_URL) {
  logger.error('AVALANCHE_RPC_URL is not defined in the environment variables');
  process.exit(1);
}

export const provider = new ethers.providers.JsonRpcProvider(
  process.env.AVALANCHE_RPC_URL
);

export const getWallet = () => {
  if (!process.env.PRIVATE_KEY) {
    logger.error('PRIVATE_KEY is not defined in the environment variables');
    process.exit(1);
  }
  return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
};

export const getContract = (address: string, abi: any) => {
  const wallet = getWallet();
  return new ethers.Contract(address, abi, wallet);
};