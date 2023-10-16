import path from "path";
import { config } from "dotenv";
import { ethers } from "hardhat";
import { DepositsResponse, MerkleProofResponse } from "../types/axios-responses";
import zkEVMBridgeAbi from "../types/zkEVMBridgeAbi.json";
import { Wallet, JsonRpcProvider } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import axios, { AxiosResponse } from "axios";
config();

const pathSenderReceiverOutput = path.join(__dirname, "../deployment/senderReceiverOutput.json");

const messageReceiverContractAddress: string = require(pathSenderReceiverOutput).messageReceiverContract as string;

const privateKey = process.env.PRIVATE_KEY as string;
const networkType = process.env.NETWORK_TYPE as string;
const mainnetBridgeAddress = "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe";
const testnetBridgeAddress = "0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7";

async function main() {
	let zkEVMBridgeContractAddress: string;
	let baseURL: string;
	let provider: JsonRpcProvider;
	let deployer: Wallet | HardhatEthersSigner;
	if (networkType === "testnet") {
		provider = new ethers.JsonRpcProvider(process.env.ZK_EVM_TESTNET_RPC as string);
		deployer = new ethers.Wallet(privateKey, provider);
		zkEVMBridgeContractAddress = testnetBridgeAddress;
		baseURL = "https://bridge-api.public.zkevm-test.net";
	} else if (networkType === "mainnet") {
		provider = new ethers.JsonRpcProvider(process.env.ZK_EVM_RPC as string);
		deployer = new ethers.Wallet(privateKey, provider);
		zkEVMBridgeContractAddress = mainnetBridgeAddress;
		baseURL = "https://bridge-api.zkevm-rpc.com";
	} else {
		[deployer] = await ethers.getSigners();
		throw new Error("Network not supported");
	}

	const instance = axios.create({
		baseURL,
	});

	const bridgeContractZkeVM = new ethers.Contract(zkEVMBridgeContractAddress, zkEVMBridgeAbi, deployer);
	const response: AxiosResponse<DepositsResponse> = await instance.get("/bridges/" + messageReceiverContractAddress, {
		params: {
			limit: 100,
			offset: 0,
		},
	});
	const depositsArray = response.data.deposits;
	if (depositsArray.length === 0) {
		console.log("Not ready yet!");
		return;
	}

	for (let i = 0; i < depositsArray.length; i++) {
		const currentDeposit = depositsArray[i];
		if (currentDeposit.ready_for_claim) {
			const proofAxios: AxiosResponse<MerkleProofResponse> = await instance.get("/merkle-proof", {
				params: {
					deposit_cnt: currentDeposit.deposit_cnt,
					net_id: currentDeposit.orig_net,
				},
			});

			const { proof } = proofAxios.data;
			const claimTx = await bridgeContractZkeVM.claimMessage(
				proof.merkle_proof,
				currentDeposit.deposit_cnt,
				proof.main_exit_root,
				proof.rollup_exit_root,
				currentDeposit.orig_net,
				currentDeposit.orig_addr,
				currentDeposit.dest_net,
				currentDeposit.dest_addr,
				currentDeposit.amount,
				currentDeposit.metadata
			);
			console.log("claim message succesfully send: ", claimTx.hash);
			await claimTx.wait();
			console.log("claim message succesfully mined");
		} else {
			console.log("bridge not ready for claim");
		}
	}
	const zkEVMProvider = new ethers.JsonRpcProvider(process.env.ZK_EVM_TESTNET_RPC as string);
	const zkEvmDeployer = new ethers.Wallet(privateKey, zkEVMProvider);
	const bridgeReceiverContract = await ethers.getContractAt(
		"ApprovalReceiver",
		"0x8dBAe3b4194457259438DCd7599d988B0c040454",
		zkEvmDeployer
	);
	console.log("permission:", await bridgeReceiverContract.getPermission(ethers.ZeroAddress));
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
