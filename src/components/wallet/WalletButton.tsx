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
      <Button onClick={handleOpen} variant="default" size="sm" className="shrink-0 text-xs sm:text-sm">
        Connect
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0 justify-end">
      {!isSupportedChain && (
        <span className="hidden sm:inline px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md shrink-0">
          Wrong chain
        </span>
      )}
      {chainConfig && (
        <span className="hidden sm:inline px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md shrink-0 truncate max-w-[120px]">
          {chainConfig.name}
        </span>
      )}
      <Button onClick={handleOpen} variant="outline" size="sm" className="shrink-0 text-xs sm:text-sm min-w-0">
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect"}
      </Button>
      {isAuthenticated && (
        <Button onClick={handleSignOut} variant="ghost" size="sm" className="shrink-0 text-xs hidden sm:inline-flex">
          Sign Out
        </Button>
      )}
    </div>
  );
}
