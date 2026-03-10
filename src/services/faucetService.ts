import { ethers } from 'ethers';
import { avalancheProvider } from '../blockchain/services/provider';
import { faucetWallet } from '../config/wallet';
import logger from '../config/logger';

// ERC20 ABI with mint function
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function mint(address to, uint256 amount) returns (bool)'
];

// Token addresses - should match what's in tokenService.ts
const TOKENS: Record<string, string> = {
  'USDC.e': process.env.TOKEN_ADDRESS || '0x...',  // Your deployed token address
};

/**
 * Fund a wallet with testnet USDC.e on Fuji by minting new tokens
 */
export const mintFujiUSDC = async (
  to: string,
  amountLocal: string,
  shouldFundGas = true
): Promise<{
  receipt: ethers.providers.TransactionReceipt,
  gasReceipt?: ethers.providers.TransactionReceipt
}> => {
  try {
    // First fund with gas if needed
    let gasReceipt;
    if (shouldFundGas) {
      try {
        gasReceipt = await fundFujiAVAX(to, '0.05');
        logger.info(`Funded ${to} with gas: ${gasReceipt.transactionHash}`);
      } catch (gasError) {
        const errorMessage = gasError instanceof Error ? gasError.message : String(gasError);
        logger.warn(`Failed to fund gas: ${errorMessage}`);
      }
    }
    
    // Convert local currency to USD (simplified conversion)
    const exchangeRate = 0.00083; // 1 NGN ≈ 0.00083 USD
    const usdAmount = (parseFloat(amountLocal) * exchangeRate).toFixed(6);
    
    logger.info(`Converting ${amountLocal} local currency to ${usdAmount} aUSD`);
    
    // Get token contract address
    const tokenAddress = TOKENS['USDC.e'];
    if (!tokenAddress) {
      throw new Error('Token address not configured');
    }
    
    // Create contract instance with admin wallet for minting
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, faucetWallet);
    
    // Get decimals
    const decimals = await tokenContract.decimals();
    logger.info(`Token decimals: ${decimals}`);
    
    // Calculate amount with proper decimals
    const amount = ethers.utils.parseUnits(usdAmount, decimals);
    
    // Mint tokens directly to user's wallet
    logger.info(`Minting ${usdAmount} aUSD to ${to}`);
    const tx = await tokenContract.mint(to, amount);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    logger.info(`Token minting completed: ${receipt.transactionHash}`);
    
    return { receipt, gasReceipt };
  } catch (error) {
    logger.error('Error minting tokens:', error);
    throw new Error(`Failed to mint tokens: ${error instanceof Error ? error.message : String(error)}`);
  }
};


/**
 * Fund a wallet with testnet AVAX for gas fees
 */
export async function fundFujiAVAX(
  to: string,
  amount: string
): Promise<ethers.providers.TransactionReceipt> {
  try {
    logger.info(`Funding ${to} with ${amount} AVAX for gas`);

    // Check faucet has enough balance before attempting
    const faucetBalance = await faucetWallet.getBalance();
    const needed = ethers.utils.parseEther(amount);
    if (faucetBalance.lt(needed)) {
      throw new Error(
        `Faucet balance too low: has ${ethers.utils.formatEther(faucetBalance)} AVAX, needs ${amount} AVAX`
      );
    }

    const tx = await faucetWallet.sendTransaction({
      to,
      value: needed,
    });

    logger.info(`AVAX gas funding tx sent: ${tx.hash}`);
    const receipt = await tx.wait();
    logger.info(`AVAX gas funding confirmed in block ${receipt.blockNumber}`);
    return receipt;
  } catch (error) {
    logger.error('Error funding AVAX gas:', error);
    throw new Error(
      `Failed to fund gas: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}