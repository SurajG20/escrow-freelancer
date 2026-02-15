import { DepositResult, ReleaseFundsResult } from "./types";
import {
  parseEther,
  parseUnits,
  formatEther,
  createPublicClient,
  http,
  type WalletClient,
} from "viem";
import { bsc, bscTestnet } from "viem/chains";
import EscrowABI from "./abis/Escrow.json";
import ERC20ABI from "./abis/ERC20.json";
import { getCurrentChainConfig } from "@/lib/config/chains";
import { getUserFriendlyError } from "./errorHandler";

async function getFeeParams(publicClient: ReturnType<typeof createPublicClient>): Promise<
  { gasPrice: bigint } | { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint }
> {
  try {
    const fees = await publicClient.estimateFeesPerGas();
    if (fees?.maxFeePerGas && fees?.maxPriorityFeePerGas) {
      return { maxFeePerGas: fees.maxFeePerGas, maxPriorityFeePerGas: fees.maxPriorityFeePerGas };
    }
    return { gasPrice: await publicClient.getGasPrice() };
  } catch {
    return { gasPrice: await publicClient.getGasPrice() };
  }
}

export async function depositFunds(
  contractAddress: string,
  amount: string,
  currency: "NATIVE" | "USDT",
  walletClient: WalletClient,
): Promise<DepositResult> {
  const chainConfig = getCurrentChainConfig();
  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  if (!walletClient) {
    throw new Error("Please connect your wallet to continue.");
  }

  let hash: `0x${string}`;
  let blockNumber: bigint;

  const feeParams = await getFeeParams(publicClient);

  try {
    if (currency === "NATIVE") {
      hash = await walletClient.writeContract({
        account: walletClient.account!,
        chain,
        address: contractAddress as `0x${string}`,
        abi: EscrowABI,
        functionName: "deposit",
        value: parseEther(amount),
        ...feeParams,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      blockNumber = receipt.blockNumber;
    } else {
      if (!chainConfig.usdtContractAddress) {
        throw new Error("USDT token is not configured for this network.");
      }

      let approveHash: `0x${string}`;
      try {
        approveHash = await walletClient.writeContract({
          account: walletClient.account!,
          chain,
          address: chainConfig.usdtContractAddress as `0x${string}`,
          abi: ERC20ABI,
          functionName: "approve",
          args: [contractAddress as `0x${string}`, parseUnits(amount, 18)],
          ...feeParams,
        });

        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      } catch (error) {
        const friendlyError = getUserFriendlyError(error);
        throw new Error(`Failed to approve USDT: ${friendlyError}`);
      }

      try {
        hash = await walletClient.writeContract({
          account: walletClient.account!,
          chain,
          address: contractAddress as `0x${string}`,
          abi: EscrowABI,
          functionName: "depositUSDT",
          args: [parseUnits(amount, 18)],
          ...feeParams,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        blockNumber = receipt.blockNumber;
      } catch (error) {
        const friendlyError = getUserFriendlyError(error);
        throw new Error(`Failed to deposit USDT: ${friendlyError}`);
      }
    }
  } catch (error) {
    const friendlyError = getUserFriendlyError(error);
    throw new Error(friendlyError);
  }

  return {
    transactionHash: hash,
    blockNumber: Number(blockNumber),
    amount,
    currency,
  };
}

export async function releaseMilestoneFunds(
  contractAddress: string,
  milestoneIndex: number,
  walletClient: WalletClient,
): Promise<ReleaseFundsResult> {
  const chainConfig = getCurrentChainConfig();
  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  if (!walletClient) {
    throw new Error("Please connect your wallet to continue.");
  }

  let hash: `0x${string}`;
  try {
    hash = await walletClient.writeContract({
      account: walletClient.account!,
      chain,
      address: contractAddress as `0x${string}`,
      abi: EscrowABI,
      functionName: "releaseMilestone",
      args: [BigInt(milestoneIndex)],
    });
  } catch (error) {
    const friendlyError = getUserFriendlyError(error);
    throw new Error(friendlyError);
  }

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const milestone = (await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "getMilestone",
    args: [BigInt(milestoneIndex)],
  })) as [bigint, boolean, number];

  return {
    transactionHash: hash,
    blockNumber: Number(receipt.blockNumber),
    milestoneIndex,
    amount: formatEther(milestone[0]),
  };
}

export async function getEscrowBalance(
  contractAddress: string,
  currency: "NATIVE" | "USDT",
): Promise<string> {
  const chainConfig = getCurrentChainConfig();
  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  const balances = (await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "getBalances",
  })) as [bigint, bigint];

  if (currency === "NATIVE") {
    return formatEther(balances[0]);
  } else {
    return formatEther(balances[1]);
  }
}

export async function submitMilestoneOnChain(
  contractAddress: string,
  milestoneIndex: number,
  walletClient: WalletClient,
): Promise<{ transactionHash: `0x${string}` }> {
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
    account: walletClient.account!,
    chain,
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "submitMilestone",
    args: [BigInt(milestoneIndex)],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return { transactionHash: hash };
}

export async function approveMilestoneOnChain(
  contractAddress: string,
  milestoneIndex: number,
  walletClient: WalletClient,
): Promise<{ transactionHash: `0x${string}` }> {
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
    account: walletClient.account!,
    chain,
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "approveMilestone",
    args: [BigInt(milestoneIndex)],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return { transactionHash: hash };
}

export async function raiseDisputeOnChain(
  contractAddress: string,
  walletClient: WalletClient,
): Promise<{ transactionHash: `0x${string}` }> {
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
    account: walletClient.account!,
    chain,
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "raiseDispute",
  });

  await publicClient.waitForTransactionReceipt({ hash });
  return { transactionHash: hash };
}

export async function resolveDisputeOnChain(
  contractAddress: string,
  milestoneIndex: number,
  releaseToFreelancer: boolean,
  walletClient: WalletClient,
): Promise<{ transactionHash: `0x${string}` }> {
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
    account: walletClient.account!,
    chain,
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "resolveDispute",
    args: [BigInt(milestoneIndex), releaseToFreelancer],
  });

  await publicClient.waitForTransactionReceipt({ hash });
  return { transactionHash: hash };
}

export async function resolveDisputeAllOnChain(
  contractAddress: string,
  releaseToFreelancer: boolean,
  walletClient: WalletClient,
): Promise<{ transactionHash: `0x${string}` }> {
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
    account: walletClient.account!,
    chain,
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "resolveDisputeAll",
    args: [releaseToFreelancer],
  });

  await publicClient.waitForTransactionReceipt({ hash });
  return { transactionHash: hash };
}

export async function getIsDisputed(contractAddress: string): Promise<boolean> {
  const chainConfig = getCurrentChainConfig();
  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  return publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi: EscrowABI,
    functionName: "isDisputed",
  }) as Promise<boolean>;
}
