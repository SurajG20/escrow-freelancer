import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWeb3Auth, signOut } from "../auth/web3";
import { useUserByWallet } from "./useUser";
import { useEffect, useState } from "react";

export function useAuth() {
  const queryClient = useQueryClient();
  const web3Auth = useWeb3Auth();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionToken = localStorage.getItem("web3_session");
      const walletAddress = localStorage.getItem("web3_wallet");

      if (sessionToken && walletAddress) {
        try {
          const sessionData = JSON.parse(atob(sessionToken));
          if (sessionData.wallet_address === walletAddress) {
            const expiresAt = sessionData.timestamp + 3600000;
            if (Date.now() < expiresAt) {
              setSession({ wallet_address: walletAddress, ...sessionData });
            } else {
              localStorage.removeItem("web3_session");
              localStorage.removeItem("web3_wallet");
            }
          }
        } catch (error) {
          localStorage.removeItem("web3_session");
          localStorage.removeItem("web3_wallet");
        }
      }
      setLoading(false);
    }
  }, []);

  const { data: user } = useUserByWallet(
    web3Auth.address || session?.wallet_address || undefined
  );

  const signInMutation = useMutation({
    mutationFn: () => web3Auth.signIn(),
    onSuccess: (data) => {
      if (data.session) {
        setSession(data.session);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
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
    !!web3Auth.isAuthenticated &&
    session.wallet_address?.toLowerCase() === web3Auth.address?.toLowerCase();

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

