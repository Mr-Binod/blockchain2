// Traditional deployment script (alternative to Ignition)
const hre = require("hardhat");

async function main() {
  console.log("Deploying BingNFT contract...");

  // Get the contract factory
  const BingNFT = await hre.ethers.getContractFactory("BingNFT");
  
  // Deploy the contract
  const bingNFT = await BingNFT.deploy();
  
  // Wait for deployment to finish
  await bingNFT.waitForDeployment();
  
  const address = await bingNFT.getAddress();
  console.log("BingNFT deployed to:", address);
  
  // Verify the deployment
  console.log("Waiting for block confirmations...");
  await bingNFT.deploymentTransaction().wait(6);
  
  // Verify on Etherscan
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 