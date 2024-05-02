require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();  // Ensure dotenv is configured at the top of the file

// Ensure the environment variables are read correctly
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey || privateKey.length !== 64) {
  console.error("Invalid private key length. The private key must be 64 hexadecimal characters.");
  process.exit(1); // Exit if the private key is not correctly set
}

module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/Qi2_Mlfi-09Jl0WnXfquP_fzD-sYdmhd`,
      accounts: [`0x${privateKey}`]  // Correctly format the private key
    }
  },
  etherscan: {
    apiKey: {
      sepolia: "1ZSK7671XWG22GPQM9Q9TKV146TZGSNF8S",
    },
  },
};
