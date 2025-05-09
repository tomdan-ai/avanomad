import express from 'express';
import mongoose from 'mongoose';
import * as tokenService from '../blockchain/services/tokenService';
import { generateDeterministicWallet, getWalletAddressFromPhoneAndPin } from '../blockchain/services/walletService';
import { User } from '../models/user.model';
import { Wallet } from '../models/wallet.model';
import { Transaction, TransactionType, TransactionStatus } from '../models/transaction.model';
import logger from '../config/logger';
import crypto from 'crypto';
import { initiateDeposit, verifyTransaction, initiateWithdrawal } from '../services/mockPaymentService';

// USSD Menu States
enum MenuState {
  MAIN = 'MAIN',
  CHECK_BALANCE = 'CHECK_BALANCE',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
  CONFIRM_TRANSACTION = 'CONFIRM_TRANSACTION',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  SET_PIN = 'SET_PIN',
  ENTER_PIN = 'ENTER_PIN'
}

// Session storage (in-memory for demo)
const sessions: Record<string, any> = {};

// Simple session cleanup (run every hour)
setInterval(() => {
  const now = Date.now();
  Object.keys(sessions).forEach(sessionId => {
    if (now - sessions[sessionId].lastActivity > 3600000) { // 1 hour
      delete sessions[sessionId];
    }
  });
}, 3600000);

// Hash PIN for secure storage - in production use bcrypt or argon2
const hashPin = (pin: string): string => {
  return crypto.createHash('sha256').update(pin).digest('hex');
};

export const handleUSSD = async (req: express.Request, res: express.Response) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    logger.debug(`USSD request: ${JSON.stringify({ sessionId, serviceCode, phoneNumber, text })}`);
    
    // Initialize session if new
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        state: MenuState.MAIN,
        data: {},
        phoneNumber,
        lastActivity: Date.now()
      };
      
      // Generate wallet address deterministically from phone number
      // We'll just check if this address exists in our database
      const walletAddress = getWalletAddressFromPhoneAndPin(phoneNumber, '0000'); // Default PIN for checking
      
      // Check if address exists in our database
      const wallet = await Wallet.findOne({ walletAddress }).exec();
      
      if (!wallet) {
        sessions[sessionId].state = MenuState.CREATE_ACCOUNT;
      } else {
        // Get user associated with this wallet
        const user = await User.findById(wallet.userId).exec();
        if (user) {
          sessions[sessionId].user = user;
          sessions[sessionId].wallet = wallet;
        } else {
          sessions[sessionId].state = MenuState.CREATE_ACCOUNT;
        }
      }
    } else {
      // Update last activity
      sessions[sessionId].lastActivity = Date.now();
    }
    
    const session = sessions[sessionId];
    let response = '';
    
    // Process based on current state and input
    switch (session.state) {
      case MenuState.CREATE_ACCOUNT:
        // Create new user and wallet
        if (text === '') {
          response = 'CON Welcome to Avanomad\n';
          response += 'You need to create an account first\n';
          response += '1. Create account';
        } else if (text === '1') {
          session.state = MenuState.SET_PIN;
          response = 'CON Please set a 4-digit PIN for your account:';
        }
        break;
        
      case MenuState.SET_PIN:
        // Validate and set PIN
        if (text.length >= 4) {
          const pin = text.split('*').pop();
          
          if (pin && pin.length === 4 && /^\d+$/.test(pin)) {
            try {
              // Generate deterministic wallet from phone number and PIN
              const wallet = generateDeterministicWallet(phoneNumber, pin);
              const hashedPin = hashPin(pin);
              
              // Create user in database, but we don't store the phone number
              // We only store a hash of the phone number for lookup
              const phoneHash = crypto.createHash('sha256').update(phoneNumber).digest('hex');
              
              const newUser = await User.create({
                phoneNumber: phoneHash, // Store hashed phone number for privacy
                pin: hashedPin, // Store hashed PIN
                walletAddress: wallet.address
              });
              
              // Create wallet in database, but don't store private key
              const newWallet = await Wallet.create({
                userId: newUser._id,
                walletAddress: wallet.address,
                // No private key storage - it can be derived when needed
                currency: 'USDC.e'
              });
              
              session.user = newUser;
              session.wallet = newWallet;
              session.state = MenuState.MAIN;
              response = 'END Account created successfully!\n';
              response += `Your wallet address: ${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}\n`;
              response += 'Remember your PIN - it\'s needed to access your wallet!';
              
              logger.info(`New account created for ${phoneHash}`);
            } catch (error) {
              logger.error('Error creating account:', error);
              response = 'END An error occurred. Please try again.';
              session.state = MenuState.MAIN;
            }
          } else {
            response = 'CON Invalid PIN. Please enter a 4-digit PIN:';
          }
        } else {
          response = 'CON Please enter a 4-digit PIN:';
        }
        break;
        
      case MenuState.CHECK_BALANCE:
        // Check balance using deterministic wallet
        try {
          const pin = text.split('*').pop() || '';
          
          // Regenerate wallet from phone number and PIN
          const wallet = generateDeterministicWallet(phoneNumber, pin);
          
          // Use this wallet to check balance directly - no need to store/retrieve private keys
          const balance = await tokenService.getBalance('USDC.e', wallet.address);
          
          response = 'END Your balance:\n';
          response += `USDC.e: ${balance}\n`;
          response += `Address: ${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}`;
          
          // Log with just a wallet address for privacy
          const phoneHash = crypto.createHash('sha256').update(phoneNumber).digest('hex');
          logger.info(`Balance checked for ${phoneHash}`);
          
          session.state = MenuState.MAIN;
        } catch (error) {
          logger.error('Error checking balance:', error);
          response = 'END An error occurred while checking your balance. Please try again.';
          session.state = MenuState.MAIN;
        }
        break;

      case MenuState.DEPOSIT:
        if (text.split('*').length === 2) { // After entering amount
          const amount = parseFloat(text.split('*').pop() || '0');
          if (isNaN(amount) || amount <= 0) {
            response = 'CON Invalid amount. Please enter a valid amount:';
          } else {
            session.data.depositAmount = amount;
            session.state = MenuState.ENTER_PIN;
            session.data.nextState = MenuState.CONFIRM_TRANSACTION;
            session.data.transactionType = TransactionType.DEPOSIT;
            response = 'CON Enter your PIN to confirm deposit:';
          }
        } else {
          response = 'CON Enter amount to deposit (in local currency):';
        }
        break;

      case MenuState.WITHDRAW:
        if (text.split('*').length === 2) { // After entering amount
          const amount = parseFloat(text.split('*').pop() || '0');
          if (isNaN(amount) || amount <= 0) {
            response = 'CON Invalid amount. Please enter a valid amount:';
          } else {
            session.data.withdrawAmount = amount;
            session.state = MenuState.ENTER_PIN;
            session.data.nextState = MenuState.CONFIRM_TRANSACTION;
            session.data.transactionType = TransactionType.WITHDRAWAL;
            response = 'CON Enter your PIN to confirm withdrawal:';
          }
        } else {
          response = 'CON Enter amount to withdraw (in USDC.e):';
        }
        break;

      case MenuState.ENTER_PIN:
        const pin = text.split('*').pop() || '';
        
        if (pin.length === 4 && /^\d+$/.test(pin)) {
          const wallet = generateDeterministicWallet(phoneNumber, pin);
          
          // Verify wallet ownership
          if (session.wallet && wallet.address.toLowerCase() === session.wallet.walletAddress.toLowerCase()) {
            if (session.data.nextState === MenuState.CONFIRM_TRANSACTION) {
              session.state = MenuState.CONFIRM_TRANSACTION;
              session.data.pin = pin;
              
              if (session.data.transactionType === TransactionType.DEPOSIT) {
                response = `CON Confirm deposit of ${session.data.depositAmount} to your wallet:\n`;
                response += '1. Confirm\n';
                response += '2. Cancel';
              } else if (session.data.transactionType === TransactionType.WITHDRAWAL) {
                response = `CON Confirm withdrawal of ${session.data.withdrawAmount} USDC.e:\n`;
                response += '1. Confirm\n';
                response += '2. Cancel';
              }
            } else {
              session.state = session.data.nextState || MenuState.MAIN;
            }
          } else {
            response = 'END Incorrect PIN. Please try again.';
            session.state = MenuState.MAIN;
          }
        } else {
          response = 'CON Invalid PIN. Please enter a 4-digit PIN:';
        }
        break;

      case MenuState.CONFIRM_TRANSACTION:
        const choice = text.split('*').pop();
        
        if (choice === '1') { // Confirm
          try {
            if (session.data.transactionType === TransactionType.DEPOSIT) {
              // Process deposit
              const depositResult = await initiateDeposit(
                session.data.depositAmount,
                phoneNumber
              );
              
              // Create transaction record
              await Transaction.create({
                userId: session.user._id,
                amount: session.data.depositAmount,
                currency: 'NGN',
                type: TransactionType.DEPOSIT,
                status: depositResult.status,
                reference: depositResult.reference,
                walletAddress: session.wallet.walletAddress
              });
              
              response = 'END Deposit initiated successfully!\n';
              response += `Amount: ${session.data.depositAmount} NGN\n`;
              response += `Reference: ${depositResult.reference}\n`;
              response += 'You will receive your USDC.e shortly.';
              
            } else if (session.data.transactionType === TransactionType.WITHDRAWAL) {
              // Process withdrawal using mock service
              const withdrawalResult = await initiateWithdrawal(
                session.data.withdrawAmount,
                phoneNumber, // Using phone number as account for demo
                'mock-bank'
              );
              
              // Create transaction record
              await Transaction.create({
                userId: session.user._id,
                amount: session.data.withdrawAmount,
                currency: 'USDC.e',
                type: TransactionType.WITHDRAWAL,
                status: withdrawalResult.status,
                reference: withdrawalResult.reference,
                walletAddress: session.wallet.walletAddress
              });
              
              response = 'END Withdrawal initiated successfully!\n';
              response += `Amount: ${session.data.withdrawAmount} USDC.e\n`;
              response += `Reference: ${withdrawalResult.reference}\n`;
              response += 'You will receive your funds shortly.';
            }
          } catch (error) {
            logger.error('Transaction error:', error);
            response = 'END An error occurred while processing your transaction. Please try again.';
          }
        } else if (choice === '2') { // Cancel
          response = 'END Transaction cancelled.';
        } else {
          response = `CON Invalid option. Confirm transaction:\n`;
          response += '1. Confirm\n';
          response += '2. Cancel';
        }
        
        session.state = MenuState.MAIN;
        break;
        
      // Additional states follow a similar pattern...
        
      default:
        response = 'END An error occurred. Please try again.';
        session.state = MenuState.MAIN;
    }
    
    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    logger.error('USSD handler error:', error);
    res.set('Content-Type', 'text/plain');
    res.send('END An error occurred. Please try again later.');
  }
};