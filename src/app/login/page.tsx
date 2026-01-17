"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Wallet, Loader2, AlertCircle, Home } from "lucide-react";
import { appKit } from "@/lib/appkit/config";
import { useWallet } from "@/lib/hooks/useWallet";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const { address, isConnected, chainConfig, isSupportedChain } = useWallet();
  const { isAuthenticated, isLoading, signIn, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleConnect = () => {
    if (appKit) {
      appKit.open();
    }
  };

  const handleSignIn = async () => {
    if (isConnected && address) {
      await signIn();
    }
  };

  const canSignIn =
    isConnected && address && isSupportedChain && !isAuthenticated;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Wallet className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Connect your wallet</CardTitle>
          <CardDescription>
            Connect your wallet and sign in to access Custodia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <>
              <Button
                onClick={handleConnect}
                variant="default"
                className="w-full h-14 "
                size="lg"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
              <p className="text-xs text-muted-foreground">
                Supported: MetaMask, WalletConnect, Phantom, and more
              </p>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div className="rounded-lg border bg-muted/50 p-4 text-left">
                  <div className="text-sm text-muted-foreground mb-1">
                    Wallet Address
                  </div>
                  <div className="font-mono text-sm break-all">{address}</div>
                </div>
                {chainConfig && (
                  <div className="rounded-lg border bg-muted/50 p-4 text-left">
                    <div className="text-sm text-muted-foreground mb-1">
                      Network
                    </div>
                    <div className="font-medium">{chainConfig.name}</div>
                  </div>
                )}
                {!isSupportedChain && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-left flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-yellow-800">
                        Unsupported Chain
                      </div>
                      <div className="text-xs text-yellow-700 mt-1">
                        Please switch to BSC Mainnet, BSC Testnet, Solana, or
                        Solana Devnet
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {canSignIn && (
                <Button
                  onClick={handleSignIn}
                  variant="default"
                  className="w-full h-14 hover:bg-accent hover:shadow-sm"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-left flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-800">
                      Sign In Failed
                    </div>
                    <div className="text-xs text-red-700 mt-1">
                      {error instanceof Error
                        ? error.message
                        : "An error occurred"}
                    </div>
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="text-sm font-medium text-green-800">
                    Successfully signed in!
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    Redirecting to dashboard...
                  </div>
                </div>
              )}

              <Button
                onClick={handleConnect}
                variant="outline"
                className="w-full hover:bg-background hover:text-foreground"
                size="sm"
              >
                Change Wallet
              </Button>
            </>
          )}

          <div className="pt-4 text-xs text-muted-foreground">
            New to crypto?{" "}
            <a
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Learn how to create a wallet
            </a>
          </div>

          <div className="pt-4 border-t">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                size="sm"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
