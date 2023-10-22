import metamaskProvider from "../rpc/metamaskProvider";
import { ApprovalSender } from "../typechain-types";
import getContractSender from "./getContractSender";
import { ErrorCode, ErrorDescription, ethers } from "ethers";

async function senderWithSigner(
  networkType: string
): Promise<ApprovalSender | undefined> {
  try {
    await window.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x5" }],
    });

    await metamaskProvider?.send("eth_requestAccounts", []);
    const signer = await metamaskProvider?.getSigner();

    if (signer) {
      return getContractSender(networkType).connect(signer) as ApprovalSender;
    } else {
      throw new Error("Access to the wallet is denied:");
    }
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum?.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x5",
              chainName: "zkEVM Testnet",
              rpcUrls: ["https://rpc.public.zkevm-test.net"],
            },
          ],
        });

        await window.ethereum?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }],
        });

        await metamaskProvider?.send("eth_requestAccounts", []);
        const signer = await metamaskProvider?.getSigner();

        if (signer) {
          return getContractSender(networkType).connect(
            signer
          ) as ApprovalSender;
        } else {
          throw new Error("Access to the wallet is denied:");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export default senderWithSigner;
