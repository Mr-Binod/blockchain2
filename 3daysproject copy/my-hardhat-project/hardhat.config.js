require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.30",
  networks: {
    // Local development network
    hardhat: {
      chainId: 1337
    },
    // Sepolia testnet
    sepolia: {
      url: process.env.SEPOLIA_URL || "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 1000000000 // 20 gwei (in wei)
    },
    // Mainnet (be careful!)
  //   mainnet: {
  //     url: process.env.MAINNET_URL || "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
  //     accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  //     chainId: 1
  //   }
  },
  // Gas settings
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  // Etherscan API key for contract verification
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};

