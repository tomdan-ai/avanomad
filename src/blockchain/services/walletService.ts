import { ethers } from 'ethers';
import crypto from 'crypto';
import logger from '../../config/logger';

/**
 * Generates a deterministic wallet address based on phone number and PIN
 * The same phone number + PIN will always generate the same wallet
 * No need to store the phone number or private key
 */
export const generateDeterministicWallet = (
  phoneNumber: string, 
  pin: string,
  salt?: string // Optional salt for additional security
): ethers.Wallet => {
  try {
    // Salt can be a fixed value for your application or environment-specific
    const appSalt = salt || process.env.WALLET_GENERATION_SALT || 'avanomad-avalanche-wallet';
    
    // Create a deterministic seed from phone number and PIN
    // This uses SHA-256 to create a secure seed from the input data
    const seedData = `${phoneNumber}-${pin}-${appSalt}`;
    const seedHash = crypto.createHash('sha256').update(seedData).digest('hex');
    
    // Create a wallet from the deterministic seed
    return ethers.Wallet.fromMnemonic(
      ethers.utils.entropyToMnemonic(
        ethers.utils.arrayify('0x' + seedHash.substring(0, 32))
      )
    );
  } catch (error) {
    logger.error('Error generating deterministic wallet:', error);
    throw new Error('Failed to generate wallet');
  }
};

/**
 * Retrieves a wallet address from phone number and PIN
 * This allows users to recover their wallet address without storing phone numbers
 */
export const getWalletAddressFromPhoneAndPin = (
  phoneNumber: string,
  pin: string,
  salt?: string
): string => {
  const wallet = generateDeterministicWallet(phoneNumber, pin, salt);
  return wallet.address;
};

/**
 * Verifies that a wallet address belongs to a given phone number and PIN
 */
export const verifyWalletOwnership = (
  phoneNumber: string,
  pin: string,
  walletAddress: string,
  salt?: string
): boolean => {
  const derivedAddress = getWalletAddressFromPhoneAndPin(phoneNumber, pin, salt);
  return derivedAddress.toLowerCase() === walletAddress.toLowerCase();
};