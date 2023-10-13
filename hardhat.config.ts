import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";
dotenv.config();

const alchemyApiKeyGoerli = process.env.ALCHEMY_API_KEY_TESTNET as string;
const alchemyApiKey = process.env.ALCHEMY_API_KEY as string;
const privateKey = process.env.PRIVATE_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKeyGoerli}`,
      accounts: [privateKey],
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [privateKey],
    },
  },
};

export default config;
