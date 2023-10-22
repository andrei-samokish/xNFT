import metamaskProvider from "../rpc/metamaskProvider";
import { ApprovalSender } from "../typechain-types";
import getContractSender from "./getContractSender";

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
              chainName: "Goerli",
              rpcUrls: ["https://goerli.infura.io/v3/"],
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
