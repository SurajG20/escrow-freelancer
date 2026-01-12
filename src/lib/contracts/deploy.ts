// @ts-nocheck
/**
 * Smart Contract Deployment Utilities
 * 
 * This file contains functions for deploying escrow smart contracts using viem/wagmi.
 * 
 * Note: These functions should be called from React components that have access to wagmi hooks.
 * For direct usage, create a hook wrapper.
 */

import { EscrowContractConfig, DeployContractResult } from "./types";
import { parseEther, createPublicClient, http, type WalletClient } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import { getCurrentChainConfig } from "@/lib/config/chains";
import EscrowFactoryABI from "./abis/EscrowFactory.json";

/**
 * Deploys an escrow smart contract for a project using the factory pattern
 * 
 * @param config - Escrow contract configuration
 * @param walletClient - Wallet client from wagmi
 * @returns Promise with deployment result including contract address
 */
export async function deployEscrowContract(
  config: EscrowContractConfig,
  walletClient: WalletClient
): Promise<DeployContractResult> {
  const chainConfig = getCurrentChainConfig();
  const factoryAddress = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS;
  
  if (!factoryAddress) {
    throw new Error("EscrowFactory address not configured. Please set NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS in .env");
  }

  if (!walletClient) {
    throw new Error("Wallet not connected");
  }

  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  // Prepare milestone data
  const milestoneAmounts = config.milestones.map(m => 
    parseEther(m.amount)
  );
  const milestoneIsNative = config.milestones.map(m => 
    m.currency === "NATIVE"
  );

  // Create escrow via factory
  const hash = await walletClient.writeContract({
    address: factoryAddress as `0x${string}`,
    abi: EscrowFactoryABI,
    functionName: "createEscrow",
    chain,
    args: [
      config.clientWallet as `0x${string}`,
      config.freelancerWallet as `0x${string}`,
      milestoneAmounts,
      milestoneIsNative,
    ],
  });

  // Wait for transaction
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
  });

  // Get user escrows to find the newly created one
  const userEscrows = await publicClient.readContract({
    address: factoryAddress as `0x${string}`,
    abi: EscrowFactoryABI,
    functionName: "getUserEscrows",
    args: [config.clientWallet as `0x${string}`],
  }) as `0x${string}`[];

  const escrowAddress = userEscrows[userEscrows.length - 1];

  return {
    contractAddress: escrowAddress,
    transactionHash: hash,
    blockNumber: Number(receipt.blockNumber),
  };
}


