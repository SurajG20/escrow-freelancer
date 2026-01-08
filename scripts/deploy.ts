import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get USDT token address from environment or use default
  const usdtTokenAddress = process.env.USDT_TOKEN_ADDRESS || "0x337610d27c682E347C9cD60BD4b3b107C9d34dD"; // BSC Testnet USDT

  // Deploy EscrowFactory
  const EscrowFactory = await ethers.getContractFactory("EscrowFactory");
  const factory = await EscrowFactory.deploy(usdtTokenAddress);
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("EscrowFactory deployed to:", factoryAddress);

  // Save deployment addresses
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("EscrowFactory:", factoryAddress);
  console.log("USDT Token:", usdtTokenAddress);
  console.log("\nCopy these addresses to your .env file:");
  console.log(`NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS=${factoryAddress}`);
  console.log(`NEXT_PUBLIC_USDT_TOKEN_ADDRESS=${usdtTokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

