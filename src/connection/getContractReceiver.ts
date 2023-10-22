import { ethers } from "ethers";
import { getProvider } from "../rpc/defaultProvider";
import { ApprovalReceiver__factory } from "../typechain-types/factories/contracts/ApprovalReceiver__factory";
import { ApprovalReceiver } from "../typechain-types";
import { Network } from "../@types/provider";

export default function getContractReceiver(
  networkType: string
): ApprovalReceiver {
  if (networkType === "testnet") {
    return new ethers.BaseContract(
      process.env.REACT_APP_RECEIVER_ADDRESS as string,
      ApprovalReceiver__factory.abi,
      getProvider(Network.ZK_EVM_TESTNET)
    ) as ApprovalReceiver;
  } else if (networkType === "mainnet") {
    return new ethers.BaseContract(
      process.env.REACT_APP_RECEIVER_ADDRESS as string,
      ApprovalReceiver__factory.abi,
      getProvider(Network.ZK_EVM)
    ) as ApprovalReceiver;
  } else {
    throw new Error("Unknown network type!");
  }
}
