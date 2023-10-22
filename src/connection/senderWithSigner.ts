import metamaskProvider from "../rpc/metamaskProvider";
import { ApprovalSender } from "../typechain-types";
import getContractSender from "./getContractSender";
import { ethers } from "ethers";

async function senderWithSigner(networkType: string): Promise<ApprovalSender> {
  await metamaskProvider?.send("eth_requestAccounts", []);
  const signer = await metamaskProvider?.getSigner();

  if (signer) {
    return getContractSender(networkType).connect(signer) as ApprovalSender;
  } else {
    throw new Error("Access to the wallet is denied:");
  }
}

export default senderWithSigner;
