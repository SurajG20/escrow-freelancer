# Smart Contract Setup Guide

## Overview

This project uses a factory contract pattern for deploying escrow contracts. The setup includes:

1. **EscrowFactory.sol** - Factory contract that creates escrow instances
2. **Escrow.sol** - Individual escrow contract per project
3. Frontend integration using viem/wagmi

## Setup Steps

### 1. Deploy Factory Contract

First, deploy the EscrowFactory contract to your network:

```bash
# For BSC Testnet
npx hardhat run scripts/deploy.ts --network bscTestnet

# For BSC Mainnet
npx hardhat run scripts/deploy.ts --network bsc
```

This will output:
- EscrowFactory address
- USDT token address

### 2. Configure Environment Variables

Add to your `.env.local`:

```env
# Network Mode (testnet or mainnet)
NEXT_PUBLIC_NETWORK_MODE=testnet

# Deployed Contract Addresses
NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_USDT_TOKEN_ADDRESS=0x...

# For Hardhat deployment (optional)
PRIVATE_KEY=your_private_key
BSC_MAINNET_RPC_URL=https://bsc-dataseed1.binance.org
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
BSCSCAN_API_KEY=your_api_key
```

### 3. Network Switching

Users can switch between mainnet and testnet by:
- Setting `NEXT_PUBLIC_NETWORK_MODE` in `.env.local`
- Or using localStorage: `localStorage.setItem("network_mode", "mainnet" | "testnet")`

The app will automatically use the correct chain configuration.

## Contract Features

### Escrow Contract

- **Deposit**: Accepts both NATIVE (BNB) and USDT tokens
- **Milestones**: Supports multiple milestones with different currencies
- **Release**: Client can release funds per milestone
- **Dispute**: Either party can raise a dispute
- **Cancel**: Client can cancel and get refund

### Factory Contract

- Creates new escrow instances
- Tracks all created escrows
- Maps users to their escrows

## Usage Flow

1. **Create Project** (Frontend)
   - User creates project with milestones
   - Status: "draft"
   - onchain_address: placeholder

2. **Deposit Funds** (Frontend + Smart Contract)
   - User clicks "Deposit Funds"
   - Factory creates new Escrow contract
   - User deposits funds (NATIVE and/or USDT)
   - Project status: "active"
   - onchain_address: deployed contract address

3. **Manage Milestones** (Frontend + Smart Contract)
   - Freelancer submits work
   - Client approves milestone
   - Client releases funds on-chain

## Contract ABIs

ABIs are located in:
- `src/lib/contracts/abis/EscrowFactory.json`
- `src/lib/contracts/abis/Escrow.json`
- `src/lib/contracts/abis/ERC20.json`

## Testing

Before deploying to mainnet:

1. Test on BSC Testnet
2. Verify contract security
3. Test all functions:
   - Deposit (NATIVE and USDT)
   - Submit milestone
   - Approve milestone
   - Release milestone
   - Cancel project
   - Raise dispute

## Known Issues

- Hardhat 3.x requires ESM, but Next.js uses CommonJS. Contracts can be compiled separately or using a different build setup.
- Contract compilation may need to be done in a separate directory or using a different tool.

## Next Steps

1. Deploy EscrowFactory to testnet
2. Update `.env.local` with contract addresses
3. Test the deposit flow
4. Deploy to mainnet when ready

