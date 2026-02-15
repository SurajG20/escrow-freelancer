# Custodia — Secure Crypto Escrow for Freelancers and Clients

Lock funds in crypto. Work with confidence. Get paid only when work is approved. Trustless escrow using smart contracts.

## Overview

Custodia is a full-stack web app that lets clients and freelancers create escrow agreements, fund them with crypto (native or USDT), and release funds per milestone. Disputes can be raised and resolved by a platform owner on-chain.

## Features

- **Landing** — Marketing page with wallet connect
- **Auth** — Wallet connect (Reown AppKit) + sign-in; supports BSC and Solana
- **Dashboard** — Overview, project stats, recent activity, quick actions
- **Projects** — Create escrow projects, add milestones, invite counterparty; list and board views
- **Project detail** — Deploy contract, deposit, submit/approve/reject milestones, raise disputes, chat-style messages
- **Escrow vaults** — View locked funds, pending release, and vault history
- **Disputes** — List and resolve disputes (platform owner); view dispute detail and project context
- **Profile & settings** — Display name, bio, avatar, connected wallets, notifications
- **Onboarding** — Role selection (client/freelancer) and profile setup
- **Mobile** — Responsive layout; sidebar becomes drawer on small screens; mobile-friendly tables (card layout) and forms

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4
- **Wallet / chains:** Reown AppKit, Wagmi, Viem; Solana adapter
- **Data:** TanStack Query, Supabase (auth, DB, storage)
- **Contracts:** EVM escrow factory + escrow (BSC); ABIs in `src/lib/contracts/abis/`
- **UI:** Radix Slot, Lucide icons, Framer Motion, Sonner toasts

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Wallet (e.g. MetaMask, WalletConnect) for BSC Testnet/Mainnet or Solana
- Supabase project for backend

## Installation

```bash
pnpm install
```

Create `.env.local` in the project root with the variables below (use `.env.example` if present: `cp .env.example .env.local`).

## Environment Variables

Create `.env.local` (do not commit). Example:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Blockchain (EVM / BSC)
NEXT_PUBLIC_RPC_URL_MAINNET=https://bsc-dataseed.binance.org
NEXT_PUBLIC_RPC_URL_TESTNET=https://data-seed-prebsc-1-2.bnbchain.org:8545
NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_USDT_TOKEN_ADDRESS=0x...   # BSC Testnet: 0x337610d27c682E347C9cD60BD4b3b107C9d34dD

# App
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_PLATFORM_OWNER_WALLET=0x...   # Wallet allowed to resolve disputes
```

See **Contract deployment** below for how to obtain the factory and USDT addresses.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `pnpm dev`     | Start dev server         |
| `pnpm build`   | Production build         |
| `pnpm start`   | Start production server  |
| `pnpm lint`    | Run ESLint               |
| `pnpm format`  | Format with Prettier     |

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    page.tsx              # Landing
    login/                # Wallet connect + sign-in
    onboarding/          # Role + profile setup
    dashboard/            # App shell (layout, sidebar, topbar)
      page.tsx            # Overview
      projects/           # List, new, [id]
      vaults/
      disputes/           # List, [id]
      profile/
      settings/
  components/
    layout/               # AppLayout, Sidebar, TopBar
    landing/              # GlassNav, FeatureCard, etc.
    auth/                 # AuthGuard
    wallet/                # WalletButton, WalletAddress
    ui/                    # Button, Card, Input, Badge, etc.
    milestones/            # MilestoneEditor, MilestoneDisplay, modals
    disputes/              # RaiseDisputeModal
    deployment/            # DeploymentModal
    providers/             # AppProviders
  lib/
    api/                   # projects, milestones, disputes, users, messages
    hooks/                 # useAuth, useProjects, useWallet, etc.
    contracts/             # deploy, escrow, ABIs
    config/                # chains
    appkit/                # Reown config
    supabase/              # client
contracts/
  EscrowFactory_Standalone.sol   # Factory + Escrow + OpenZeppelin (Remix-ready)
```

## Contract Deployment

The app expects an **EscrowFactory** (and optionally USDT) to be deployed on BSC Testnet (or Mainnet). Use the standalone contract so no Remix plugins are needed.

### 1. Open Remix

- Go to [remix.ethereum.org](https://remix.ethereum.org)
- Create `contracts/EscrowFactory_Standalone.sol` and paste the contents of `contracts/EscrowFactory_Standalone.sol` from this repo

### 2. Compile

- Solidity **0.8.20**
- Optimization **on** (200 runs)
- Compile `EscrowFactory_Standalone.sol`

### 3. Deploy on BSC Testnet

- Environment: **Injected Provider - MetaMask**
- Network: **BSC Testnet** (Chain ID 97)
- Get test BNB: [testnet.bnbchain.org/faucet](https://testnet.bnbchain.org/faucet)
- Deploy **EscrowFactory** with constructor argument = USDT address:
  - BSC Testnet USDT: `0x337610d27c682E347C9cD60BD4b3b107C9d34dD`
  - BSC Mainnet USDT: `0x55d398326f99059fF775485246999027B3197955`

### 4. Configure app

- Copy the deployed factory address into `.env.local` as `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS`
- Set `NEXT_PUBLIC_USDT_TOKEN_ADDRESS` to the same USDT address you used in the constructor

### Contract features (OpenZeppelin)

- **ReentrancyGuard** — deposit/release safety
- **Ownable** — only owner can call `resolveDispute()`
- **SafeERC20** / **IERC20** — safe USDT handling

Optional: verify the contract on [BSCScan Testnet](https://testnet.bscscan.com) (Compiler 0.8.20, Optimization 200 runs).

## Supported Networks

- **BSC Testnet** (97) — default for development
- **BSC Mainnet** (56) — production
- **Solana** — wallet connect and chain display (escrow logic is EVM/BSC in this repo)

## Troubleshooting

- **Insufficient funds** — Use BSC Testnet faucet for test BNB.
- **Contract not found** — Ensure `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS` and RPC URLs match the network (testnet vs mainnet).
- **Wrong chain** — Switch wallet to BSC Testnet (or the network set in `NEXT_PUBLIC_NETWORK`).
- **Build errors** — Run `pnpm install` and ensure Node 18+; clear `.next` and rebuild.

## Security

- Never commit `.env.local` or real API keys.
- Test on testnet before mainnet.
- Platform owner wallet (`NEXT_PUBLIC_PLATFORM_OWNER_WALLET`) is the only address that can resolve disputes on-chain.
