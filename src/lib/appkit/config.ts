import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { getNetworkMode } from "@/lib/config/chains";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";

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

const defaultNetwork = getNetworkMode() === "mainnet" ? bsc : bscTestnet;

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [defaultNetwork],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ["google", "github"],
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

