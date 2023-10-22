import { ethers } from "hardhat";
import { config } from "dotenv";
import path from "path";
import { writeFileSync } from "fs";
import { JsonRpcProvider, Wallet } from "ethers";
import { ApprovalSender__factory, XNFT__factory } from "../src/typechain-types";

config();

async function main() {
  let zkEVMProvider: JsonRpcProvider;
  let alchemyProvider: JsonRpcProvider;
  let deployer: Wallet;
  let zkEvmDeployer: Wallet;
  let bridgeAddress = "0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7";
  const networkType = process.env.REACT_APP_NETWORK_TYPE as string;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY as string;

  if (networkType === "testnet") {
    alchemyProvider = new ethers.AlchemyProvider(
      "goerli",
      process.env.REACT_APP_ALCHEMY_API_KEY as string
    );
    zkEVMProvider = new ethers.JsonRpcProvider(
      process.env.REACT_APP_ZK_EVM_TESTNET_RPC as string
    );
    deployer = new ethers.Wallet(privateKey, alchemyProvider);
    zkEvmDeployer = new ethers.Wallet(privateKey, zkEVMProvider);
  } else if (networkType === "mainnet") {
    alchemyProvider = new ethers.AlchemyProvider(
      "mainnet",
      process.env.REACT_APP_ALCHEMY_API_KEY as string
    );
    zkEVMProvider = new ethers.JsonRpcProvider(
      process.env.REACT_APP_ZK_EVM_RPC as string
    );
    deployer = new ethers.Wallet(privateKey, alchemyProvider);
    zkEvmDeployer = new ethers.Wallet(privateKey, zkEVMProvider);
  } else {
    throw new Error("Network not supported");
  }
  console.log("Network type: ", networkType);
  console.log(
    "zkEVM deployer: ",
    zkEvmDeployer.address,
    "\n",
    `${networkType} deployer: `,
    deployer.address
  );
  // MessageSender deploying on Goerli
  const bridgeSenderFactory: ApprovalSender__factory =
    await ethers.getContractFactory("ApprovalSender", deployer);
  const bridgeSenderContract = await bridgeSenderFactory.deploy(bridgeAddress);
  await bridgeSenderContract.waitForDeployment();
  let senderAddress = await bridgeSenderContract.getAddress();

  console.log("Message sender deployed on: ", senderAddress);

  // MessageReceiver (xNFT) deploying on zkEVM testnet
  const bridgeReceiverFactory = await ethers.getContractFactory(
    "XNFT",
    zkEvmDeployer
  );
  const bridgeReceiverContract = await bridgeReceiverFactory.deploy(
    bridgeAddress
  );
  await bridgeReceiverContract.waitForDeployment();
  let receiverAddress = await bridgeReceiverContract.getAddress();

  console.log("Message receiver deployed on: ", receiverAddress);
  console.log("Message sender deployed on: ", senderAddress);

  await bridgeSenderContract.setReceiver(receiverAddress);
  await bridgeReceiverContract.setSender(senderAddress);

  const outputJson = {
    messageSenderContract: senderAddress,
    xNFT: receiverAddress,
  };

  const pathOutputJson = path.join(__dirname, "./senderReceiverOutput.json");
  writeFileSync(pathOutputJson, JSON.stringify(outputJson, null, 1));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
