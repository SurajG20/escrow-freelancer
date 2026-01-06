"use client";

import { appKit } from "@/lib/appkit/config";
import { useWallet } from "@/lib/hooks/useWallet";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function WalletButton() {
  const { address, isConnected, chainConfig, isSupportedChain } = useWallet();
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const handleOpen = () => {
    if (appKit) {
      appKit.open();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (!isConnected) {
    return (
      <Button onClick={handleOpen} variant="default">
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isSupportedChain && (
        <div className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md">
          Unsupported Chain
        </div>
      )}
      {chainConfig && (
        <div className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
          {chainConfig.name}
        </div>
      )}
      <Button onClick={handleOpen} variant="outline">
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect"}
      </Button>
      {isAuthenticated && (
        <Button onClick={handleSignOut} variant="ghost" size="sm">
          Sign Out
        </Button>
      )}
    </div>
  );
}


