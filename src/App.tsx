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
  const [stage, setStage] = useState(1);
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
    let t: NodeJS.Timeout;
    const fetchFata = async () => {
      try {
        const response: AxiosResponse<DepositsResponse> = await axios.get(
          `${process.env.REACT_APP_ZK_EVM_TESTNET_ENDPOINT as string}${
            process.env.REACT_APP_RECEIVER_ADDRESS
          }`,
          {
            params: {
              limit: 100,
              offset: 0,
            },
          }
        );

        const depositsArray = response.data.deposits;

        if (depositsArray.length === 0) {
          setTimeout(fetchFata, 5000);
          setStage(1);
        } else {
          if (!depositsArray[0].ready_for_claim) {
            setStage(2);
            setBridgeMessageStatus("Not ready for mint");
            setTimeout(fetchFata, 5000);
          } else {
            setStage(3);
            setBridgeMessageStatus("Ready for claim");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFata();

    return () => {
      clearTimeout(t);
    };
  }, []);

  return (
    <Layout>
      <Main />
      <FunctionalBar stage={stage} />
      <ProgressBar stage="1/3" />
    </Layout>
  );
}

export default App;
