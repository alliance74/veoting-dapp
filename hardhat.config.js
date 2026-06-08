require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // Uncomment and fill in to deploy to Sepolia testnet:
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    //   accounts: ["0xYOUR_PRIVATE_KEY"],
    // },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
