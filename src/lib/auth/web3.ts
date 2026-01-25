import { supabase } from "../supabase/client";
import { useConnection, useSignMessage } from "wagmi";         
import { useAppKitAccount } from "@reown/appkit/react";
import { createUser, getUserByWallet } from "../api/users";
import type { User } from "@/types";

export interface Web3AuthResult {
  user: User | null;
  sessionToken: string | null;
  error: Error | null;
}

// getNonce and verifySignature remain unchanged
async function getNonce(address: string): Promise<string> {
  const { data, error } = await supabase.rpc("get_nonce", {
    wallet_address: address.toLowerCase(),
  });

  if (error) {
    throw new Error(`Failed to get nonce: ${error.message}`);
  }

  return data || Math.random().toString(36).substring(7);
}

async function verifySignature(
  address: string,
  message: string,
  signature: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("verify_web3_signature", {
      wallet_address: address.toLowerCase(),
      message,
      signature,
    });

    if (error) {
      console.error("Signature verification error:", error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

export async function signInWithWeb3(
  walletAddress: string,
  chainId: number | string,
  signature: string,
  message: string,
): Promise<Web3AuthResult> {
  try {
    const address = walletAddress.toLowerCase();

    const isValid = await verifySignature(address, message, signature);
    if (!isValid) {
      throw new Error("Invalid signature");
    }

    const user = await ensureUserProfile(address);

    const sessionToken = btoa(
      JSON.stringify({
        wallet_address: address,
        signature: signature.substring(0, 20),
        timestamp: Date.now(),
      }),
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("web3_session", sessionToken);
      localStorage.setItem("web3_wallet", address);
    }

    return {
      user,
      sessionToken,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      sessionToken: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

async function ensureUserProfile(walletAddress: string): Promise<User> {
  try {
    const existingUser = await getUserByWallet(walletAddress);

    if (existingUser) {
      return existingUser;
    }

    const newUser = await createUser({
      wallet_address: walletAddress,
      roles: ["client"],
    });

    return newUser;
  } catch (error) {
    console.error("Failed to ensure user profile:", error);
    throw error;
  }
}

export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("web3_session");
    localStorage.removeItem("web3_wallet");
  }
}

export function useWeb3Auth() {
  const { address, chainId, isConnected: isWagmiConnected } = useConnection(); 
  const { isConnected: isAppKitConnected } = useAppKitAccount();

  const { mutateAsync: signMessage } = useSignMessage(); 

  const signIn = async () => {
    if (!address || !isWagmiConnected || !isAppKitConnected) {
      throw new Error("Wallet not connected");
    }

    const nonce = await getNonce(address);
    const message = `Sign in to Custodia\n\nNonce: ${nonce}\nAddress: ${address}`;

    try {
      const signature = await signMessage({ message });

      return signInWithWeb3(address, chainId || 1, signature, message);
    } catch (error) {
      console.error("Signing failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to sign message"
      );
    }
  };

  return {
    signIn,
    signOut,
    isAuthenticated: isWagmiConnected && isAppKitConnected && !!address,
    address,
    chainId: chainId || 1,
  };
}