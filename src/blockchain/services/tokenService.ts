import { ethers } from 'ethers';
import { provider, getWallet, getContract } from './provider';
import logger from '../../config/logger';

// Standard ERC20 ABI (minimal)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

// Token addresses on Avalanche C-Chain
const TOKENS: Record<string, string> = {
  'USDC.e': '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
  'USDT.e': '0xc7198437980c041c805A1EDcbA50c1Ce5db95118'
};

export const getTokenContract = (symbol: string) => {
  const address = TOKENS[symbol];
  if (!address) {
    logger.error(`Token ${symbol} not supported`);
    throw new Error(`Token ${symbol} not supported`);
  }
  return getContract(address, ERC20_ABI);
};

export const getBalance = async (symbol: string, address: string): Promise<string> => {
  try {
    const contract = getTokenContract(symbol);
    const balance = await contract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 6); // Assuming 6 decimals for stablecoins
  } catch (error) {
    logger.error(`Error getting balance for ${symbol}:`, error);
    throw error;
  }
};

export const transfer = async (
  symbol: string,
  to: string,
  amount: string
): Promise<ethers.providers.TransactionReceipt> => {
  try {
    const contract = getTokenContract(symbol);
    const decimals = 6; // Assuming 6 decimals for stablecoins
    const parsedAmount = ethers.utils.parseUnits(amount, decimals);
    
    const tx = await contract.transfer(to, parsedAmount);
    logger.info(`Transfer initiated: ${amount} ${symbol} to ${to}`);
    return await tx.wait();
  } catch (error) {
    logger.error(`Error transferring ${symbol}:`, error);
    throw error;
  }
};

export const approve = async (
  symbol: string,
  spender: string,
  amount: string
): Promise<ethers.providers.TransactionReceipt> => {
  try {
    const contract = getTokenContract(symbol);
    const decimals = 6;
    const parsedAmount = ethers.utils.parseUnits(amount, decimals);
    
    const tx = await contract.approve(spender, parsedAmount);
    logger.info(`Approval initiated: ${amount} ${symbol} for ${spender}`);
    return await tx.wait();
  } catch (error) {
    logger.error(`Error approving ${symbol}:`, error);
    throw error;
  }
};