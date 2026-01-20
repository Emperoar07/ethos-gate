import { ethers, hre } from "hardhat";

async function main() {
  console.log("========================================");
  console.log("Deploying ReputationPayments Contract");
  console.log("========================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || deployer.address;

  console.log("Configuration:");
  console.log("- USDC Address:", USDC_ADDRESS);
  console.log("- Treasury Address:", TREASURY_ADDRESS);
  console.log("");

  console.log("Deploying contract...");
  const ReputationPayments = await ethers.getContractFactory("ReputationPayments");
  const contract = await ReputationPayments.deploy(USDC_ADDRESS, TREASURY_ADDRESS);

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contract deployed to:", address);
  console.log("");

  console.log("Waiting for 5 block confirmations...");
  const deployTx = contract.deploymentTransaction();
  if (deployTx) {
    await deployTx.wait(5);
    console.log("✅ Confirmed!\n");
  }

  console.log("Verifying contract on Basescan...");
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments: [USDC_ADDRESS, TREASURY_ADDRESS]
    });
    console.log("✅ Contract verified!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract already verified!\n");
    } else {
      console.log("⚠️ Verification failed:", error.message, "\n");
    }
  }

  console.log("========================================");
  console.log("Deployment Summary");
  console.log("========================================");
  console.log("Contract Address:", address);
  console.log("USDC Address:", USDC_ADDRESS);
  console.log("Treasury Address:", TREASURY_ADDRESS);
  console.log("Network: Base Sepolia");
  console.log("Explorer:", `https://sepolia.basescan.org/address/${address}`);
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
