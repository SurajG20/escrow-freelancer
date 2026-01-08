/**
 * Escrow Contract Interaction Utilities
 * 
 * This file contains functions for interacting with deployed escrow contracts using viem/wagmi.
 */

import { DepositResult, ReleaseFundsResult } from "./types";
import { parseEther, parseUnits, formatEther, createPublicClient, http, type WalletClient } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import EscrowABI from "./abis/Escrow.json";
import ERC20ABI from "./abis/ERC20.json";
import { getCurrentChainConfig } from "@/lib/config/chains";

/**
 * Deposits funds into an escrow contract
 * 
 * @param contractAddress - Address of the deployed escrow contract
 * @param amount - Amount to deposit
 * @param currency - Currency type (NATIVE or USDT)
 * @returns Promise with deposit transaction details
 */
export async function depositFunds(
  contractAddress: string,
  amount: string,
  currency: "NATIVE" | "USDT",
  walletClient: WalletClient
): Promise<DepositResult> {
  const chainConfig = getCurrentChainConfig();
  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  if (!walletClient) {
    throw new Error("Wallet not connected");
  }

  let hash: `0x${string}`;
  let blockNumber: bigint;

  if (currency === "NATIVE") {
    // Deposit native tokens (BNB)
    hash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: EscrowABI,
      functionName: "deposit",
      value: parseEther(amount),
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    blockNumber = receipt.blockNumber;
  } else {
    // Deposit USDT tokens
    if (!chainConfig.usdtContractAddress) {
      throw new Error("USDT contract address not configured for this chain");
    }

    // First, approve the escrow contract to spend USDT
    const approveHash = await walletClient.writeContract({
      address: chainConfig.usdtContractAddress as `0x${string}`,
      abi: ERC20ABI,
      functionName: "approve",
      args: [contractAddress as `0x${string}`, parseUnits(amount, 18)],
    });

    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    // Then deposit USDT
    hash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: EscrowABI,
      functionName: "depositUSDT",
      args: [parseUnits(amount, 18)],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    blockNumber = receipt.blockNumber;
  }

  return {
    transactionHash: hash,
    blockNumber: Number(blockNumber),
    amount,
    currency,
  };
}

/**
 * Releases funds for a specific milestone
 * 
 * @param contractAddress - Address of the deployed escrow contract
 * @param milestoneIndex - Index of the milestone to release
 * @returns Promise with release transaction details
 */
export async function releaseMilestoneFunds(
  contractAddress: string,
  milestoneIndex: number,
  walletClient: WalletClient
): Promise<ReleaseFundsResult> {
  const chainConfig = getCurrentChainConfig();
  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  if (!walletClient) {
    throw new Error("Wallet not connected");
  }

  const hash = await walletClient.writeContract({
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "releaseMilestone",
    args: [BigInt(milestoneIndex)],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Get milestone amount for return value
  const milestone = await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "getMilestone",
    args: [BigInt(milestoneIndex)],
  }) as [bigint, boolean, number];

  return {
    transactionHash: hash,
    blockNumber: Number(receipt.blockNumber),
    milestoneIndex,
    amount: formatEther(milestone[0]),
  };
}

/**
 * Gets the balance of funds in an escrow contract
 * 
 * @param contractAddress - Address of the deployed escrow contract
 * @param currency - Currency type to check
 * @returns Promise with balance amount
 */
export async function getEscrowBalance(
  contractAddress: string,
  currency: "NATIVE" | "USDT"
): Promise<string> {
  const chainConfig = getCurrentChainConfig();
  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  const balances = await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "getBalances",
  }) as [bigint, bigint];

  if (currency === "NATIVE") {
    return formatEther(balances[0]);
  } else {
    return formatEther(balances[1]);
  }
}


