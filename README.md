# Escrow Contract Deployment Guide with OpenZeppelin

## Overview

This guide shows how to deploy the Escrow contracts using Remix IDE with OpenZeppelin security libraries.

## Contracts

- **EscrowFactory.sol** - Factory contract that creates escrow instances
- **Escrow.sol** - Main escrow contract with milestone management

Both contracts use OpenZeppelin libraries for security:

- `ReentrancyGuard` - Prevents reentrancy attacks
- `Ownable` - Access control for dispute resolution
- `SafeERC20` - Safe ERC20 token transfers
- `IERC20` - Standard ERC20 interface

## Step 1: Open Remix IDE

1. Go to https://remix.ethereum.org
2. Create a new workspace or use the default

## Step 2: Add Standalone Contracts (No Plugin Needed!)

**No OpenZeppelin plugin required!** Use the standalone contracts that include all OpenZeppelin code inline.

### Create `contracts/EscrowFactory_Standalone.sol`

1. In Remix, go to **File Explorer**
2. Create a new file: `contracts/EscrowFactory_Standalone.sol`
3. Copy the **entire content** from `contracts/EscrowFactory_Standalone.sol` in your project
4. This file includes:
   - All OpenZeppelin code (ReentrancyGuard, Ownable, SafeERC20, IERC20)
   - The Escrow contract (complete)
   - The EscrowFactory contract

**That's it!** No plugins, no manual setup, no authentication needed. Just copy-paste and deploy.

## Step 3: Compile Contract

1. Go to **Solidity Compiler** tab
2. Select compiler version: **0.8.20**
3. Enable optimization: **Yes** (200 runs)
4. Click **Compile EscrowFactory_Standalone.sol**
5. Ensure there are no errors

**Note:** Only compile `EscrowFactory_Standalone.sol` - it contains everything you need!

## Step 4: Connect to BSC Testnet

1. Go to **Deploy & Run Transactions** tab
2. In **Environment**, select **Injected Provider - MetaMask**
3. Make sure MetaMask is connected to **BSC Testnet**

### Add BSC Testnet to MetaMask (if needed):

- **Network Name**: BSC Testnet
- **RPC URL**: `https://data-seed-prebsc-1-s1.binance.org:8545`
- **Chain ID**: `97`
- **Currency Symbol**: `BNB`
- **Block Explorer**: `https://testnet.bscscan.com`

## Step 5: Get Testnet BNB

Before deploying, get testnet BNB for gas fees:

1. Go to https://testnet.bnbchain.org/faucet-smart
2. Enter your wallet address
3. Request testnet BNB
4. Wait for the transaction to complete

## Step 6: Deploy EscrowFactory

1. In **Deploy & Run Transactions** tab:
   - Select **EscrowFactory** from the contract dropdown (from EscrowFactory_Standalone.sol)
   - In the deploy section, you'll see a constructor parameter field
2. Enter the USDT token address for BSC Testnet:

   ```
   0x337610d27c682E347C9cD60BD4b3b107C9d34dD
   ```

3. Click **Deploy**

4. Confirm the transaction in MetaMask

5. Wait for deployment to complete (usually 10-30 seconds)

## Step 7: Get the Factory Address

After successful deployment:

1. The contract address will appear in the **Deployed Contracts** section
2. It will look like: `0x1234567890abcdef...`
3. **Copy this address** - this is your `EscrowFactory` address

## Step 8: Update Environment Variables

Add the deployed factory address to your `.env.local`:

```env
NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS=0x... # Paste your deployed factory address here
NEXT_PUBLIC_USDT_TOKEN_ADDRESS=0x337610d27c682E347C9cD60BD4b3b107C9d34dD
```

## Step 9: Verify Contract (Optional but Recommended)

1. Go to https://testnet.bscscan.com
2. Search for your deployed contract address
3. Click on the **Contract** tab
4. Click **Verify and Publish**
5. Fill in the form:
   - **Compiler Version**: `0.8.20`
   - **License**: `MIT`
   - **Optimization**: `Yes` (200 runs)
   - **Enter the Solidity Contract Code**: Copy from `contracts/EscrowFactory_Standalone.sol`
6. Click **Verify and Publish**

## Important Addresses

### BSC Testnet

- **USDT Token**: `0x337610d27c682E347C9cD60BD4b3b107C9d34dD`
- **EscrowFactory**: (Deploy to get address)

### BSC Mainnet (For Production)

- **USDT Token**: `0x55d398326f99059fF775485246999027B3197955`
- **EscrowFactory**: (Deploy when ready for production)

## Security Features (OpenZeppelin)

The contracts use OpenZeppelin libraries for security:

### ReentrancyGuard

- Prevents reentrancy attacks on deposit and release functions
- Uses the checks-effects-interactions pattern

### Ownable

- Allows dispute resolution by contract owner
- Only owner can call `resolveDispute()`

### SafeERC20

- Safe ERC20 token transfers
- Handles tokens that don't return boolean values
- Prevents common ERC20 transfer issues

### IERC20

- Standard ERC20 interface
- Ensures compatibility with all ERC20 tokens

## Troubleshooting

### "Insufficient funds for gas"

- Get testnet BNB from the faucet: https://testnet.bnbchain.org/faucet-smart
- Make sure you have at least 0.01 BNB for deployment

### "Contract compilation failed"

- Ensure OpenZeppelin plugin is activated
- Check compiler version is 0.8.20
- Verify all imports are correct
- Make sure `Escrow.sol` is compiled before `EscrowFactory.sol`

### "OpenZeppelin contracts not found"

- **Solution:** Use `EscrowFactory_Standalone.sol` instead - it includes all OpenZeppelin code inline
- No plugin or manual setup needed!

### "Transaction failed"

- Check you're on BSC Testnet (Chain ID: 97)
- Verify you have enough BNB for gas
- Ensure the USDT address is correct: `0x337610d27c682E347C9cD60BD4b3b107C9d34dD`

### "Invalid USDT address"

- For BSC Testnet: `0x337610d27c682E347C9cD60BD4b3b107C9d34dD`
- For BSC Mainnet: `0x55d398326f99059fF775485246999027B3197955`

## Testing the Deployment

After deployment, test the factory:

1. In Remix, under **Deployed Contracts**, find your EscrowFactory
2. Expand it to see available functions
3. Test `getEscrowCount()` - should return `0`
4. Test `usdtToken()` - should return the USDT address

## Next Steps

1. ✅ Deploy EscrowFactory to testnet
2. ✅ Copy the factory address
3. ✅ Update `.env.local` with the address
4. ✅ Restart your Next.js app: `pnpm dev`
5. ✅ Test creating a project and depositing funds
6. ✅ Verify the contract on BSCScan

## Security Best Practices

- ✅ Always verify contracts on block explorer
- ✅ Test thoroughly on testnet before mainnet
- ✅ Use OpenZeppelin libraries (already included)
- ✅ Get security audit before mainnet deployment
- ✅ Never share your private keys
- ✅ Use dedicated wallets for testing

## Support

If you encounter issues:

1. Check the Remix console for error messages
2. Verify all addresses are correct
3. Ensure you're on the correct network
4. Check you have sufficient balance for gas
