import { ethers } from "ethers";
import { getProvider } from "../scripts/rpc/defaultProvider";
import { ApprovalReceiver__factory } from "../typechain-types/factories/contracts/ApprovalReceiver__factory";
import { ApprovalSender__factory } from "../typechain-types/factories/contracts/ApprovalSender__factory";
import { Network } from "../types/provider";

export default function getContract(
  contract: string,
  networkType: Network
): ethers.BaseContract {
  switch (contract) {
    case "sender":
      return new ethers.Contract(
        process.env.SENDER_ADDRESS as string,
        ApprovalSender__factory.abi,
        getProvider(networkType)
      );
    case "receiver":
      return new ethers.Contract(
        process.env.RECEIVER_ADDRESS as string,
        ApprovalReceiver__factory.abi,
        getProvider(networkType)
      );
    default:
      throw new Error("Can't resolve this contract type");
  }
}
