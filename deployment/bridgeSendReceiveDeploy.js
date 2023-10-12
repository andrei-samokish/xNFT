import { ethers } from "hardhat";
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
dotenv.config();

async function main() {
  const zkEVMProvider = new ethers.JsonRpcProvider(
    process.env.ZK_EVM_TESTNET_RPC
  );
  const privateKey = process.env.PRIVATE_KEY;

  const goerliDeployer = new ethers.Wallet(
    privateKey,
    ethers.provider
  );
  const zkEvmTestnetDeployer = new ethers.Wallet(
    privateKey,
    zkEVMProvider
  );
  console.log(
    "Using pvtKey deployer with address: ",
    goerliDeployer.address
  );
  // MessageSender deploying on Goerli
  const bridgeSenderFactory =
    await ethers.getContractFactory(
      "MessageSender",
      goerliDeployer
    );
  const bridgeSenderContract =
    await bridgeSenderFactory.deploy();
  await bridgeSenderContract.deployed();

  console.log(
    "Message sender deployed on: ",
    bridgeSenderContract.getAddress()
  );

  // MessageReceiver deploying on zkEVM testnet
  const bridgeReceiverFactory =
    await ethers.getContractFactory(
      "MessageReceiver",
      zkEvmTestnetDeployer
    );

  const bridgeReceiverContract =
    await bridgeReceiverFactory.deploy();
  await bridgeReceiverContract.deployed();

  await bridgeSenderContract.setReceiver(
    bridgeReceiverContract.address
  );
  await bridgeReceiverContract.setSender(
    bridgeSenderContract.address
  );

  const outputJson = {
    messageSenderContract: bridgeSenderContract.address,
    messageReceiverContract: bridgeReceiverContract.address,
  };

  const pathOutputJson = path.join(
    __dirname,
    "./senderReceiverOutput.json"
  );
  fs.writeFileSync(
    pathOutputJson,
    JSON.stringify(outputJson, null, 1)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
