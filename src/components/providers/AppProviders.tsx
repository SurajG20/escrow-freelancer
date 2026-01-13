"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/appkit/config";
import { Toaster } from "sonner";
import { useState } from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: true,
            retry: 1,
            refetchOnMount: true,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={5000}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}


