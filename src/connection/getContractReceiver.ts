import { ethers } from "ethers";
import { getProvider } from "../rpc/defaultProvider";
import { XNFT, XNFT__factory } from "../typechain-types";
import { Network } from "../@types/provider";

export default function getContractReceiver(networkType: string): XNFT {
  if (networkType === "testnet") {
    return new ethers.BaseContract(
      process.env.REACT_APP_RECEIVER_ADDRESS as string,
      XNFT__factory.abi,
      getProvider(Network.ZK_EVM_TESTNET)
    ) as XNFT;
  } else if (networkType === "mainnet") {
    return new ethers.BaseContract(
      process.env.REACT_APP_RECEIVER_ADDRESS as string,
      XNFT__factory.abi,
      getProvider(Network.ZK_EVM)
    ) as XNFT;
  } else {
    throw new Error("Unknown network type!");
  }
}
