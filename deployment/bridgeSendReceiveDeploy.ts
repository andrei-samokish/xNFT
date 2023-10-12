import { ethers } from "hardhat";
import { config } from "dotenv";
import path from "path";
import { writeFileSync } from "fs";
import { JsonRpcProvider, Wallet } from "ethers";

config();

async function main() {
  let zkEVMProvider: JsonRpcProvider;
  let alchemyProvider: JsonRpcProvider;
  let deployer: Wallet;
  let zkEvmDeployer: Wallet;
  const networkType = process.env.NETWORK_TYPE as string;
  const privateKey = process.env.PRIVATE_KEY as string;
  alchemyProvider = new ethers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY as string
  );
  if (networkType === "testnet") {
    zkEVMProvider = new ethers.JsonRpcProvider(
      process.env.ZK_EVM_TESTNET_RPC as string
    );
    deployer = new ethers.Wallet(
      privateKey,
      alchemyProvider
    );
    zkEvmDeployer = new ethers.Wallet(
      privateKey,
      zkEVMProvider
    );
  } else if (networkType === "mainnet") {
    zkEVMProvider = new ethers.JsonRpcProvider(
      process.env.ZK_EVM_RPC as string
    );
    deployer = new ethers.Wallet(
      privateKey,
      alchemyProvider
    );
    zkEvmDeployer = new ethers.Wallet(
      privateKey,
      zkEVMProvider
    );
  } else {
    throw new Error("Network not supported");
  }
  console.log("Network type:  ", networkType);
  console.log(
    "zkEVM deployer:  ",
    zkEvmDeployer.address,
    "\n",
    `${networkType} deployer:  `,
    deployer.address
  );
  // MessageSender deploying on Goerli
  const bridgeSenderFactory =
    await ethers.getContractFactory(
      "MessageSender",
      deployer
    );
  const bridgeSenderContract =
    await bridgeSenderFactory.deploy();
  await bridgeSenderContract.waitForDeployment();
  let sednerAddress =
    await bridgeSenderContract.getAddress();

  console.log(
    "Message sender deployed on: ",
    sednerAddress
  );

  // MessageReceiver deploying on zkEVM testnet
  const bridgeReceiverFactory =
    await ethers.getContractFactory(
      "MessageReceiver",
      zkEvmDeployer
    );

  const bridgeReceiverContract =
    await bridgeReceiverFactory.deploy();
  await bridgeReceiverContract.waitForDeployment();
  let receiverAddress =
    await bridgeReceiverContract.getAddress();

  console.log(
    "Message receiver deployed on: ",
    receiverAddress
  );

  await bridgeSenderContract.setReceiver(receiverAddress);
  await bridgeReceiverContract.setSender(sednerAddress);

  const outputJson = {
    messageSenderContract: sednerAddress,
    messageReceiverContract: receiverAddress,
  };

  const pathOutputJson = path.join(
    __dirname,
    "./senderReceiverOutput.json"
  );
  writeFileSync(
    pathOutputJson,
    JSON.stringify(outputJson, null, 1)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
