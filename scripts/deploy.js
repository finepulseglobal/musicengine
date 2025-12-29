const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Copyright Smart Contracts...");

  // Deploy CopyrightRegistry
  const CopyrightRegistry = await ethers.getContractFactory("CopyrightRegistry");
  const copyrightRegistry = await CopyrightRegistry.deploy();
  await copyrightRegistry.deployed();
  
  console.log("CopyrightRegistry deployed to:", copyrightRegistry.address);

  // Deploy RoyaltyDistributor
  const RoyaltyDistributor = await ethers.getContractFactory("RoyaltyDistributor");
  const royaltyDistributor = await RoyaltyDistributor.deploy(copyrightRegistry.address);
  await royaltyDistributor.deployed();
  
  console.log("RoyaltyDistributor deployed to:", royaltyDistributor.address);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    copyrightRegistry: copyrightRegistry.address,
    royaltyDistributor: royaltyDistributor.address,
    deployedAt: new Date().toISOString()
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });