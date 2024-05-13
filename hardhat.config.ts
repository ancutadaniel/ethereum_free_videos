import { task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "dotenv/config";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";

// Test task
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async ({ account }, { ethers }) => {
    const balance = await ethers.provider.getBalance(account);
    console.log(ethers.utils.formatEther(balance), "ETH");
  });


console.log(`
  ========================================
  Hardhat config file loaded successfully. 🚀 🚀 🚀
  ========================================
`);

// npx hardhat balance --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// log 10000.0 ETH

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // defaultNetwork: "sepolia",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};