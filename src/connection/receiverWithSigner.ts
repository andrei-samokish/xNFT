import metamaskProvider from "../rpc/metamaskProvider";
import { XNFT } from "../typechain-types";
import getContractReceiver from "./getContractReceiver";
import { ethers } from "ethers";

async function receiverWithSigner(networkType: string): Promise<XNFT> {
  await metamaskProvider?.send("eth_requestAccounts", []);
  const signer = await metamaskProvider?.getSigner();

  if (signer) {
    return getContractReceiver(networkType).connect(signer) as XNFT;
  } else {
    throw new Error("Access to the wallet is denied:");
  }
}

export default receiverWithSigner;
