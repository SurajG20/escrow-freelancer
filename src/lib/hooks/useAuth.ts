import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWeb3Auth, signOut } from "../auth/web3";
import { useUserByWallet } from "./useUser";
import { useEffect, useState } from "react";

interface SessionData {
  wallet_address: string;
  signature?: string;
  timestamp: number;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const web3Auth = useWeb3Auth();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionToken = localStorage.getItem("web3_session");
      const walletAddress = localStorage.getItem("web3_wallet");

      if (sessionToken && walletAddress) {
        try {
          const sessionData = JSON.parse(atob(sessionToken)) as SessionData;
          if (sessionData.wallet_address === walletAddress) {
            const expiresAt = sessionData.timestamp + 3600000;
            if (Date.now() < expiresAt) {
               
              setSession(sessionData);
            } else {
              localStorage.removeItem("web3_session");
              localStorage.removeItem("web3_wallet");
            }
          }
        } catch {
          localStorage.removeItem("web3_session");
          localStorage.removeItem("web3_wallet");
        }
      }
      setLoading(false);
    }
  }, []);

  const { data: user } = useUserByWallet(
    web3Auth.address || session?.wallet_address || undefined,
  );

  const signInMutation = useMutation({
    mutationFn: () => web3Auth.signIn(),
    onSuccess: (data) => {
      if (data.error) {
        console.error("Sign in returned error:", data.error);
        return;
      }

      if (data.session) {
        const sessionToken =
          typeof window !== "undefined"
            ? localStorage.getItem("web3_session")
            : null;
        const walletAddress =
          typeof window !== "undefined"
            ? localStorage.getItem("web3_wallet")
            : null;

        if (sessionToken && walletAddress) {
          try {
            const sessionData = JSON.parse(atob(sessionToken)) as SessionData;
            if (sessionData.wallet_address === walletAddress) {
              setSession(sessionData);
            }
          } catch (error) {
            console.error("Failed to parse session token:", error);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Sign in mutation error:", error);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setSession(null);
    },
  });

  const isAuthenticated =
    !!session &&
    (!web3Auth.address ||
      session.wallet_address?.toLowerCase() ===
        web3Auth.address?.toLowerCase());

  return {
    session,
    user,
    address: web3Auth.address || session?.wallet_address,
    chainId: web3Auth.chainId,
    isAuthenticated,
    isLoading: loading || signInMutation.isPending,
    signIn: () => signInMutation.mutate(),
    signOut: () => signOutMutation.mutate(),
    error: signInMutation.error || signOutMutation.error,
  };
}
