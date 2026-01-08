# Smart Contract Integration

This directory contains utilities for deploying and interacting with escrow smart contracts.

## Structure

- `types.ts` - TypeScript type definitions for contract interactions
- `deploy.ts` - Contract deployment functions
- `escrow.ts` - Contract interaction functions (deposit, release, etc.)
- `README.md` - This file

## Implementation Guide

### Step 1: Create Smart Contracts

You'll need to create Solidity contracts (for EVM chains) or Rust programs (for Solana):

**Recommended Contract Structure:**
- `EscrowFactory.sol` - Factory contract that creates escrow instances
- `Escrow.sol` - Individual escrow contract per project

**Key Features:**
- Accept deposits (NATIVE and USDT)
- Store milestone information
- Release funds per milestone
- Handle disputes
- Support refunds

### Step 2: Compile Contracts

For EVM chains:
```bash
npx hardhat compile
# or
npx truffle compile
```

For Solana:
```bash
anchor build
```

### Step 3: Deploy Contracts

Deploy the factory contract once, then use it to create escrow instances per project.

### Step 4: Implement Functions

Update the functions in `deploy.ts` and `escrow.ts` with actual contract interaction logic using:
- `ethers.js` for EVM chains
- `@solana/web3.js` for Solana

### Step 5: Add Contract ABIs

Create an `abis/` directory and store contract ABIs:
- `EscrowFactory.json`
- `Escrow.json`
- `ERC20.json` (for USDT)

### Step 6: Integration

The deposit funds flow in `src/app/dashboard/projects/[id]/page.tsx` calls these functions. Once implemented, the full flow will work end-to-end.

## Example Contract Interface

```solidity
interface IEscrow {
    function deposit() external payable;
    function depositUSDT(uint256 amount) external;
    function releaseMilestone(uint256 milestoneIndex) external;
    function cancel() external;
    function getBalance() external view returns (uint256);
    function getUSDTBalance() external view returns (uint256);
}
```

## Testing

Before deploying to mainnet:
1. Test on testnets (BSC Testnet, Solana Devnet)
2. Verify contract security with audits
3. Test all edge cases (disputes, refunds, etc.)


