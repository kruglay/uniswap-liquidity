import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/addLiquidity";

const config: HardhatUserConfig = {
  defaultNetwork: 'localhost',
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY || "",
    },
  },

  networks: {
    hardhat: {
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      blockGasLimit: 30000000,
      gas: 30000000,
      hardfork: 'istanbul',
    },
    goerli: {
      url: "https://goerli.infura.io/v3/",
      chainId: 5,
      gas: 30000000,
      accounts: {
        count: 10,
        mnemonic: process.env.MNEMONIC || "",
      },
    },

  },
  solidity: {
    compilers: [
      {
        version: "0.5.0",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.7.6",
      },
      {
        version: "0.8.19",
        settings: {},
      },
    ],
  },
};

export default config;
