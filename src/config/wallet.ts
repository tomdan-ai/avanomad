import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import dotenv from 'dotenv';
import logger from './logger';
import { avalancheProvider, ethereumProvider } from '../blockchain/services/provider';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY || PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY not set in environment');
}

if (!FAUCET_PRIVATE_KEY) {
  throw new Error('FAUCET_PRIVATE_KEY not set in environment');
}

// Admin wallet (Avalanche)
export const adminWallet = new ethers.Wallet(PRIVATE_KEY, avalancheProvider);

// Faucet wallet on Avalanche Fuji C-Chain
export const faucetWallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, avalancheProvider);

// Same key on Ethereum Sepolia
export const faucetWalletEth = new ethers.Wallet(FAUCET_PRIVATE_KEY, ethereumProvider);

// Get balance of faucet wallet
export const getFaucetBalance = async (token = 'AVAX') => {
  try {
    if (token === 'AVAX') {
      const balance = await faucetWallet.getBalance();
      return {
        formatted: formatEther(balance),
        raw: balance
      };
    }

    if (token === 'ETH') {
      const balance = await faucetWalletEth.getBalance();
      return {
        formatted: formatEther(balance),
        raw: balance
      };
    }

    return { formatted: '0', raw: '0' };
  } catch (error) {
    logger.error('Error checking faucet balance:', error);
    return { formatted: '0', raw: '0' };
  }
};

// Log faucet wallet info
export const logFaucetInfo = async () => {
  try {
    logger.info(`Faucet wallet address: ${faucetWallet.address}`);

    const avaxBalance = await getFaucetBalance('AVAX');
    const ethBalance = await getFaucetBalance('ETH');

    logger.info(`Faucet AVAX balance: ${avaxBalance.formatted}`);
    logger.info(`Faucet ETH balance: ${ethBalance.formatted}`);
  } catch (error) {
    logger.error('Error logging faucet info:', error);
  }
};