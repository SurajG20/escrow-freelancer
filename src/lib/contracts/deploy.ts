import { EscrowContractConfig, DeployContractResult } from "./types";
import {
  parseEther,
  formatEther,
  createPublicClient,
  http,
  decodeEventLog,
  type WalletClient,
} from "viem";
import { bsc, bscTestnet } from "viem/chains";
import { getCurrentChainConfig } from "@/lib/config/chains";
import EscrowFactoryABI from "./abis/EscrowFactory.json";
import { getUserFriendlyError } from "./errorHandler";

export interface DeployGasEstimate {
  gas: bigint;
  gasFormatted: string;
  estimatedCostWei: bigint;
  estimatedCostFormatted: string;
  nativeSymbol: string;
}

export async function estimateDeployGas(
  config: EscrowContractConfig,
  walletClient: WalletClient
): Promise<DeployGasEstimate | null> {
  const chainConfig = getCurrentChainConfig();
  const factoryAddress = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS;
  if (!factoryAddress || !walletClient?.account) return null;

  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  const milestoneAmounts = config.milestones.map((m) => parseEther(m.amount));
  const milestoneIsNative = config.milestones.map((m) => m.currency === "NATIVE");

  try {
    const gas = await publicClient.estimateContractGas({
      account: walletClient.account,
      address: factoryAddress as `0x${string}`,
      abi: EscrowFactoryABI,
      functionName: "createEscrow",
      args: [
        config.clientWallet as `0x${string}`,
        config.freelancerWallet as `0x${string}`,
        milestoneAmounts,
        milestoneIsNative,
      ],
    });

    const gasPrice = await publicClient.getGasPrice();
    const estimatedCostWei = gas * gasPrice;

    return {
      gas,
      gasFormatted: gas.toString(),
      estimatedCostWei,
      estimatedCostFormatted: formatEther(estimatedCostWei),
      nativeSymbol: chainConfig.nativeSymbol,
    };
  } catch {
    return null;
  }
}

export async function deployEscrowContract(
  config: EscrowContractConfig,
  walletClient: WalletClient,
): Promise<DeployContractResult> {
  const chainConfig = getCurrentChainConfig();
  const factoryAddress = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS;

  if (!factoryAddress) {
    throw new Error(
      "EscrowFactory contract is not configured. Please contact support.",
    );
  }

  if (!walletClient) {
    throw new Error("Please connect your wallet to continue.");
  }

  const chain = chainConfig.network === "mainnet" ? bsc : bscTestnet;
  const publicClient = createPublicClient({
    chain,
    transport: http(chainConfig.rpcUrl),
  });

  const milestoneAmounts = config.milestones.map((m) => parseEther(m.amount));
  const milestoneIsNative = config.milestones.map(
    (m) => m.currency === "NATIVE",
  );
  let hash: `0x${string}`;
  try {
    hash = await walletClient.writeContract({
      account: walletClient.account!,
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
  } catch (error) {
    const friendlyError = getUserFriendlyError(error);
    throw new Error(friendlyError);
  }

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  let escrowAddress: `0x${string}` | null = null;

  if (receipt.logs && receipt.logs.length > 0) {
    try {
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: EscrowFactoryABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "EscrowCreated") {
            escrowAddress = (decoded.args as unknown as { escrow: `0x${string}` }).escrow;
            break;
          }
        } catch {
          continue;
        }
      }
    } catch {}
  }

  if (!escrowAddress || escrowAddress === "0x") {
    try {
      const allEscrows = (await publicClient.readContract({
        address: factoryAddress as `0x${string}`,
        abi: EscrowFactoryABI,
        functionName: "getAllEscrows",
      })) as `0x${string}`[];

      if (allEscrows && allEscrows.length > 0) {
        escrowAddress = allEscrows[allEscrows.length - 1];
      }
    } catch (error) {
      console.error("Failed to retrieve escrow address:", error);
    }
  }

  if (!escrowAddress || escrowAddress === "0x" || escrowAddress.length !== 42) {
    throw new Error(
      "Failed to retrieve the escrow contract address. The transaction was successful, but we couldn't find the contract address. Please contact support with transaction hash: " +
        hash.substring(0, 10) +
        "...",
    );
  }

  return {
    contractAddress: escrowAddress,
    transactionHash: hash,
    blockNumber: Number(receipt.blockNumber),
  };
}
