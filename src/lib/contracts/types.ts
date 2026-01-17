/**
 * Smart Contract Type Definitions
 *
 * This file contains TypeScript types for smart contract interactions.
 * Update these types when you implement the actual smart contracts.
 */

export interface EscrowContractConfig {
  clientWallet: string;
  freelancerWallet: string;
  milestones: Array<{
    amount: string;
    currency: "NATIVE" | "USDT";
  }>;
  chainId: number;
}

export interface DeployContractResult {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
}

export interface DepositResult {
  transactionHash: string;
  blockNumber: number;
  amount: string;
  currency: "NATIVE" | "USDT";
}

export interface ReleaseFundsResult {
  transactionHash: string;
  blockNumber: number;
  milestoneIndex: number;
  amount: string;
}
