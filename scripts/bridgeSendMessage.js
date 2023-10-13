import { ethers } from "hardhat";
const dotenv = require("dotenv");
dotenv.config();

const testnetBridgeAddress =
  "0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7";

const networkIDzkEVM = 1;
const baseUrl =
  "https://bridge-api.public.zkevm-test.net/bridges/";

const pathOutput = path.join(
  __dirname,
  "../deployment/senderReceiverOutput.json"
);
const messageSenderContractAddress =
  require(pathOutput).messageSenderContract;

async function main() {
  //load deployer
  const privateKey = process.env.PRIVATE_KEY;

  const goerliDeployer = new ethers.Wallet(
    privateKey,
    ethers.provider
  );

  const bridgeSenderFactory =
    await ethers.getContractFactory(
      "MessageSender",
      goerliDeployer
    );

  const bridgeSenderContract =
    await bridgeSenderFactory.attach(
      messageSenderContractAddress
    );

  const data = "testData";

  const tx = await bridgeSenderContract.sendMessage(data);

  console.log(await tx.wait());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
