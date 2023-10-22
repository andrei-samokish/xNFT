import metamaskProvider from "../rpc/metamaskProvider";
import { ApprovalReceiver } from "../typechain-types";
import getContractReceiver from "./getContractReceiver";
import { ethers } from "ethers";

async function receiverWithSigner(
  networkType: string
): Promise<ApprovalReceiver> {
  await metamaskProvider?.send("eth_requestAccounts", []);
  const signer = await metamaskProvider?.getSigner();

  if (signer) {
    return getContractReceiver(networkType).connect(signer) as ApprovalReceiver;
  } else {
    throw new Error("Access to the wallet is denied:");
  }
}

export default receiverWithSigner;
