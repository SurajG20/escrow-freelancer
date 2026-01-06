export type ChainId = number | string;

export interface ChainConfig {
  chainId: ChainId;
  name: string;
  nativeSymbol: string;
  usdtContractAddress: string | null;
  rpcUrl: string;
  blockExplorerUrl: string;
  supportedTokens: ("NATIVE" | "USDT")[];
  type: "evm" | "solana";
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    chainId: 56,
    name: "Binance Smart Chain",
    nativeSymbol: "BNB",
    usdtContractAddress: "0x55d398326f99059fF775485246999027B3197955",
    rpcUrl: "https://bsc-dataseed1.binance.org",
    blockExplorerUrl: "https://bscscan.com",
    supportedTokens: ["NATIVE", "USDT"],
    type: "evm",
  },
  {
    chainId: 97,
    name: "BSC Testnet",
    nativeSymbol: "BNB",
    usdtContractAddress: null,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    blockExplorerUrl: "https://testnet.bscscan.com",
    supportedTokens: ["NATIVE"],
    type: "evm",
  },
  {
    chainId: "solana:mainnet",
    name: "Solana",
    nativeSymbol: "SOL",
    usdtContractAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    blockExplorerUrl: "https://solscan.io",
    supportedTokens: ["NATIVE", "USDT"],
    type: "solana",
  },
  {
    chainId: "solana:devnet",
    name: "Solana Devnet",
    nativeSymbol: "SOL",
    usdtContractAddress: null,
    rpcUrl: "https://api.devnet.solana.com",
    blockExplorerUrl: "https://solscan.io/?cluster=devnet",
    supportedTokens: ["NATIVE"],
    type: "solana",
  },
];

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

export function getEVMChains(): ChainConfig[] {
  return SUPPORTED_CHAINS.filter((chain) => chain.type === "evm");
}

export function getSolanaChains(): ChainConfig[] {
  return SUPPORTED_CHAINS.filter((chain) => chain.type === "solana");
}


