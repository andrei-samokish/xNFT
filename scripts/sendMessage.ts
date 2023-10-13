import path from "path";
import { config } from "dotenv";
//import { ethers } from "hardhat";
import { JsonRpcProvider, Wallet } from "ethers";
import { ethers } from "hardhat";
config();

const pathSenderReceiverOutput = path.join(
  __dirname,
  "../deployment/senderReceiverOutput.json"
);

const messageSenderContractAddress: string =
  require(pathSenderReceiverOutput)
    .messageSenderContract as string;

const privateKey = process.env.PRIVATE_KEY as string;

async function main() {
  const alchemyProvider = new ethers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY as string
  );
  let deployer = new ethers.Wallet(
    privateKey,
    alchemyProvider
  );

  const bridgeSenderFactory =
    await ethers.getContractFactory(
      "ApprovalSender",
      deployer
    );

  const bridgeSenderContract =
    await bridgeSenderFactory.attach(
      messageSenderContractAddress
    );

  const tx = await bridgeSenderContract.bridgePingMessage(
    "test123"
  );

  console.log(await tx.wait());
  console.log("Bridge done succesfully");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
