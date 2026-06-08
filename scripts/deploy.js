const hre = require("hardhat");
const fs  = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Voting contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📟 Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance : ${hre.ethers.utils.formatEther(balance)} ETH`);

  // Deploy
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.deployed();                      // ethers v5

  const address = voting.address;               // ethers v5
  console.log(`✅ Voting deployed at: ${address}`);

  // Save ABI + address to frontend/
  const artifact = hre.artifacts.readArtifactSync("Voting");
  const frontendDir = path.join(__dirname, "..", "frontend");
  fs.mkdirSync(frontendDir, { recursive: true });

  fs.writeFileSync(
    path.join(frontendDir, "contract.json"),
    JSON.stringify({ address, abi: artifact.abi }, null, 2)
  );
  console.log("📄 ABI + address saved to frontend/contract.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
