require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/bXVsZXhsIcgy7ceLe92s7v8vZsQG64hB";
const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL || "https://polygon-amoy.g.alchemy.com/v2/bXVsZXhsIcgy7ceLe92s7v8vZsQG64hB";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your-wallet-private-key";

module.exports = {
  solidity: "0.8.17",
  networks: {
    polygon: {
      url: POLYGON_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    polygonMumbai: {
      url: POLYGON_AMOY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
