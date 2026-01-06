import { useAccount, useChainId, useDisconnect } from "wagmi";
import { isSupportedChain, getChainConfig, getSupportedTokens } from "../config/chains";

export function useWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const supported = isSupportedChain(chainId);
  const chainConfig = getChainConfig(chainId);
  const supportedTokens = getSupportedTokens(chainId);

  return {
    address,
    chainId,
    isConnected,
    isSupportedChain: supported,
    chainConfig,
    supportedTokens,
    disconnect,
  };
}


