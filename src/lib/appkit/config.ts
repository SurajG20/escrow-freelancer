import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { bsc, bscTestnet } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";

if (!projectId) {
  console.warn(
    "Reown AppKit project ID is not set. Wallet connection may not work."
  );
}

const metadata = {
  name: "Escrow dApp",
  description: "Decentralized milestone-based escrow platform",
  url: typeof window !== "undefined" ? window.location.origin : "",
  icons: [],
};

const evmNetworks = [bsc, bscTestnet];

const wagmiAdapter = new WagmiAdapter({
  networks: evmNetworks,
  projectId,
  ssr: true,
});

const solanaAdapter = new SolanaAdapter();

export const appKit = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks: [bsc],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ["google", "github"],
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

