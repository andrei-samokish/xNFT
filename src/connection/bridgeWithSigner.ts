import metamaskProvider from "../rpc/metamaskProvider";
import { ApprovalReceiver } from "../typechain-types";
import getBridgeContract from "./getBridgeContract";
import getContractReceiver from "./getContractReceiver";

export default async function bridgeWithSigner(networkType: string) {
	try {
		await window.ethereum?.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: "0x5a2" }],
		});

		await metamaskProvider?.send("eth_requestAccounts", []);
		const signer = await metamaskProvider?.getSigner();

		if (signer) {
			return getBridgeContract().connect(signer);
		} else {
			throw new Error("Access to the wallet is denied:");
		}
	} catch (switchError: any) {
		if (switchError.code === 4902) {
			try {
				await window.ethereum?.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainId: "0x5a2",
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

				if (signer) return getBridgeContract().connect(signer);
				else throw new Error("Access to the wallet is denied:");
			} catch (error) {
				console.log(error);
			}
		}
	}
}
