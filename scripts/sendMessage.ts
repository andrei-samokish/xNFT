import path from "path";
import { config } from "dotenv";
//import { ethers } from "hardhat";
import { ethers } from "hardhat";
import { JsonRpcProvider, Wallet } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
config();

const pathSenderReceiverOutput = path.join(__dirname, "../deployment/senderReceiverOutput.json");
const messageSenderContractAddress: string = require(pathSenderReceiverOutput).messageSenderContract as string;

const privateKey = process.env.PRIVATE_KEY as string;
const networkType = process.env.NETWORK_TYPE as string;

async function main() {
	let alchemyProvider: JsonRpcProvider;
	let deployer: Wallet | HardhatEthersSigner;
	if (networkType === "testnet") {
		alchemyProvider = new ethers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY as string);
		deployer = new ethers.Wallet(privateKey, alchemyProvider);
	} else if (networkType === "mainnet") {
		alchemyProvider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_API_KEY as string);
		deployer = new ethers.Wallet(privateKey, alchemyProvider);
	} else {
		[deployer] = await ethers.getSigners();
		throw new Error("Network not supported");
	}
	const bridgeSenderFactory = await ethers.getContractFactory("ApprovalSender", deployer);
	const bridgeSenderContract = bridgeSenderFactory.attach(messageSenderContractAddress);
	const tx = await bridgeSenderContract.bridgePingMessage(ethers.ZeroAddress);

	console.log(await tx.wait());
	console.log("Message sent succesfully");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
