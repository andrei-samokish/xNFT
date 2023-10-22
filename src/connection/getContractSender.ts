import { ethers } from "ethers";
import { getProvider } from "../rpc/defaultProvider";
import { ApprovalSender__factory } from "../typechain-types/factories/contracts/ApprovalSender__factory";
import { ApprovalSender } from "../typechain-types/contracts/ApprovalSender";
import { Network } from "../@types/provider";

export default function getContractSender(networkType: string): ApprovalSender {
  if (networkType === "testnet") {
    return new ethers.BaseContract(
      process.env.REACT_APP_SENDER_ADDRESS as string,
      ApprovalSender__factory.abi,
      getProvider(Network.GOERLI)
    ) as ApprovalSender;
  } else if (networkType === "mainnet") {
    return new ethers.BaseContract(
      process.env.REACT_APP_SENDER_ADDRESS as string,
      ApprovalSender__factory.abi,
      getProvider(Network.ETHEREUM_MAINNET)
    ) as ApprovalSender;
  } else {
    throw new Error("Unknown network type!");
  }
}
