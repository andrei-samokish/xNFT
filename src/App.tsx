import Layout from "./components/Layout";
import Main from "./components/Main";
import FunctionalBar from "./components/FunctionalBar";
import ProgressBar from "./components/ProgressBar";
import { AddressLike, ethers } from "ethers";
import getContractSender from "./connection/getContractSender";
import { useState, useEffect } from "react";
import metamaskProvider from "./rpc/metamaskProvider";
import getContractReceiver from "./connection/getContractReceiver";
import axios, { AxiosResponse } from "axios";
import { DepositsResponse } from "./@types/axios-responses";
import { useSDK } from "@metamask/sdk-react";

function App() {
  const [accountSender, setAccountSender] = useState<string>("");
  const [bridgeMessageStatus, setBridgeMessageStatus] = useState<string>(
    "Verification is in progress"
  );
  const senderContract = getContractSender(
    process.env.REACT_APP_NETWORK_TYPE as string
  );
  const receiverContract = getContractReceiver(
    process.env.REACT_APP_NETWORK_TYPE as string
  );

  const { sdk, connected, connecting, provider, chainId, account } = useSDK();

  useEffect(() => {
    senderContract?.once(
      senderContract.filters["MessageSent(address)"],
      (_accountSender: string) => {
        if (_accountSender === account) {
          setAccountSender(_accountSender);
          setBridgeMessageStatus("The message has been sent");
        }
      }
    );

    receiverContract?.once(
      receiverContract.filters["MessageReceived(address)"],
      (_accountReceiver: string) => {
        if (_accountReceiver === account) {
          setBridgeMessageStatus("The message has been received");
        }
      }
    );
  }, []);

  useEffect(() => {
    let baseUrl: string;
    let t: NodeJS.Timeout;

    if (process.env.REACT_APP_NETWORK_TYPE === "testnet")
      baseUrl = process.env.REACT_APP_ZK_EVM_TESTNET_ENDPOINT as string;
    else if (process.env.REACT_APP_NETWORK_TYPE === "mainnet")
      baseUrl = process.env.REACT_APP_ZK_EVM_TESTNET_ENDPOINT as string;
    else throw new Error("unknown network");

    const fetchData = async () => {
      try {
        const response: AxiosResponse<DepositsResponse> = await axios.get(
          `${baseUrl}${accountSender}`,
          {
            params: {
              limit: 100,
              offset: 0,
            },
          }
        );
        const depositsArray = response.data.deposits;
        if (depositsArray.length === 0) {
          return;
        }
        if (!depositsArray[0].ready_for_claim) {
          t = setTimeout(fetchData, 15000);
          console.log("wait");
        } else {
          console.log("ready for claim!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      clearTimeout(t);
    };
  }, [accountSender]);

  return (
    <Layout>
      <Main />
      <FunctionalBar bridgeMessageStatus={bridgeMessageStatus} />
      <ProgressBar stage="1/3" />
    </Layout>
  );
}

export default App;
