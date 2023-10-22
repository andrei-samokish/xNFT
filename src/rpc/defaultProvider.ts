import { JsonRpcProvider, ethers } from "ethers";
import { Network } from "../@types/provider";

export function getProvider(network: Network): JsonRpcProvider {
  switch (network) {
    case Network.GOERLI:
      return new ethers.AlchemyProvider(
        "goerli",
        process.env.REACT_APP_ALCHEMY_API_KEY as string
      );
    case Network.ETHEREUM_MAINNET:
      return new ethers.AlchemyProvider(
        "mainnet",
        process.env.REACT_APP_ALCHEMY_API_KEY as string
      );
    case Network.ZK_EVM_TESTNET:
      return new ethers.JsonRpcProvider(
        process.env.REACT_APP_ZK_EVM_TESTNET_RPC as string
      );
    case Network.ZK_EVM:
      return new ethers.JsonRpcProvider(
        process.env.REACT_APP_ZK_EVM_RPC as string
      );
    default:
      throw new Error("Network: network not supported");
  }
}
