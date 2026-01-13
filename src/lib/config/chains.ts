export type ChainId = number;

export type NetworkMode = "mainnet" | "testnet";

export interface ChainConfig {
  chainId: ChainId;
  name: string;
  nativeSymbol: string;
  usdtContractAddress: string | null;
  rpcUrl: string;
  blockExplorerUrl: string;
  supportedTokens: ("NATIVE" | "USDT")[];
  type: "evm";
  network: NetworkMode;
}

function getUSDTAddress(): string {
  const envAddress = process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS;
  if (envAddress) {
    return envAddress;
  }
  return "0x337610d27c682E347C9cD60BD4b3b107C9d34dD";
}

// BSC Mainnet Configuration
export const BSC_MAINNET: ChainConfig = {
  chainId: 56,
  name: "Binance Smart Chain",
  nativeSymbol: "BNB",
  usdtContractAddress: process.env.NEXT_PUBLIC_NETWORK_MODE === "mainnet" 
    ? (process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS || "0x55d398326f99059fF775485246999027B3197955")
    : null,
  rpcUrl: "https://bsc-dataseed1.binance.org",
  blockExplorerUrl: "https://bscscan.com",
  supportedTokens: ["NATIVE", "USDT"],
  type: "evm",
  network: "mainnet",
};

// BSC Testnet Configuration
export const BSC_TESTNET: ChainConfig = {
  chainId: 97,
  name: "BSC Testnet",
  nativeSymbol: "BNB",
  usdtContractAddress: getUSDTAddress(),
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  blockExplorerUrl: "https://testnet.bscscan.com",
  supportedTokens: ["NATIVE", "USDT"],
  type: "evm",
  network: "testnet",
};

export function getNetworkMode(): NetworkMode {
  if (typeof window !== "undefined") {
    const mode = localStorage.getItem("network_mode") as NetworkMode | null;
    return mode === "mainnet" || mode === "testnet" ? mode : "testnet";
  }
  return (process.env.NEXT_PUBLIC_NETWORK_MODE as NetworkMode) || "testnet";
}

export function setNetworkMode(mode: NetworkMode) {
  if (typeof window !== "undefined") {
    localStorage.setItem("network_mode", mode);
  }
}

export function getCurrentChainConfig(): ChainConfig {
  const mode = getNetworkMode();
  const config = mode === "mainnet" ? BSC_MAINNET : BSC_TESTNET;
  
  // Override USDT address from environment if set
  if (process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS) {
    return {
      ...config,
      usdtContractAddress: process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS,
    };
  }
  
  return config;
}

export function getEscrowFactoryAddress(): string {
  const factoryAddress = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS;
  if (!factoryAddress) {
    throw new Error("EscrowFactory address not configured. Please set NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS in .env.local");
  }
  return factoryAddress;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [BSC_MAINNET, BSC_TESTNET];

export function getChainConfig(chainId: ChainId): ChainConfig | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId);
}

export function isSupportedChain(chainId: ChainId): boolean {
  return SUPPORTED_CHAINS.some((chain) => chain.chainId === chainId);
}

export function getSupportedTokens(chainId: ChainId): ("NATIVE" | "USDT")[] {
  const chain = getChainConfig(chainId);
  return chain?.supportedTokens || ["NATIVE"];
}


