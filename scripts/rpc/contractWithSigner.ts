import metamaskProvider from "./metamaskProvier";
import getContract from "../../deployment/getContract";
import { Network } from "../../types/provider";
import { ethers } from "ethers";

async function contractWithSigner(
  contract: string,
  networkType: Network
): Promise<ethers.BaseContract> {
  await metamaskProvider?.send("eth_requestAccounts", []);
  const signer = await metamaskProvider?.getSigner();
  if (signer) {
    return getContract(contract, networkType).connect(signer);
  } else {
    throw new Error("Access to the wallet is denied:");
  }
}

export default contractWithSigner;
