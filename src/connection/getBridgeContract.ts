import { ethers } from "ethers";
import { IPolygonZkEVMBridge, IPolygonZkEVMBridge__factory } from "../typechain-types";
import { getProvider } from "../rpc/defaultProvider";
import { Network } from "../@types/provider";

export default function getBridgeContract() {
	return new ethers.BaseContract(
		process.env.REACT_APP_RECEIVER_ADDRESS as string,
		IPolygonZkEVMBridge__factory.abi,
		getProvider(Network.ZK_EVM_TESTNET)
	) as IPolygonZkEVMBridge;
}
