import { supabase } from "../supabase/client";
import { useAccount, useSignMessage } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { createUser, getUserByWallet } from "../api/users";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface Web3AuthResult {
  user: SupabaseUser | null;
  session: Session | null;
  error: Error | null;
}

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
  signature: string
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
  message: string
): Promise<Web3AuthResult> {
  try {
    const address = walletAddress.toLowerCase();

    const isValid = await verifySignature(address, message, signature);
    if (!isValid) {
      throw new Error("Invalid signature");
    }

    await ensureUserProfile(address);

    const user = await getUserByWallet(address);
    if (!user) {
      throw new Error("Failed to create user profile");
    }

    const sessionToken = btoa(JSON.stringify({
      wallet_address: address,
      signature: signature.substring(0, 20),
      timestamp: Date.now(),
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem("web3_session", sessionToken);
      localStorage.setItem("web3_wallet", address);
    }

    const mockUser = {
      id: user.id,
      email: null,
      phone: null,
      created_at: user.created_at,
      updated_at: user.updated_at,
      app_metadata: {},
      user_metadata: {
        wallet_address: address,
      },
      aud: "authenticated",
      confirmation_sent_at: null,
      recovery_sent_at: null,
      email_change_sent_at: null,
      new_email: null,
      invited_at: null,
      action_link: null,
      email_change: null,
      phone_change: null,
      phone_confirmed_at: null,
      email_confirmed_at: null,
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: "authenticated",
    } as unknown as SupabaseUser;

    const mockSession = {
      access_token: sessionToken,
      refresh_token: sessionToken,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: "bearer",
      user: mockUser,
    } as unknown as Session;

    return {
      user: mockUser,
      session: mockSession,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

async function ensureUserProfile(
  walletAddress: string
) {
  try {
    const existingUser = await getUserByWallet(walletAddress);

    if (!existingUser) {
      await createUser({
        wallet_address: walletAddress,
        roles: ["client"],
      });
    }
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
  const { address, chainId } = useAccount();
  const { isConnected } = useAppKitAccount();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    if (!address || !isConnected) {
      throw new Error("Wallet not connected");
    }

    const nonce = await getNonce(address);
    const message = `Sign in to Escrow dApp\n\nNonce: ${nonce}\nAddress: ${address}`;

    try {
      const signature = await signMessageAsync({ message });
      return signInWithWeb3(address, chainId || 1, signature, message);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to sign message"
      );
    }
  };

  return {
    signIn,
    signOut,
    isAuthenticated: isConnected && !!address,
    address,
    chainId: chainId || 1,
  };
}

