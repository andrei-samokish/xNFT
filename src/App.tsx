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
	const [bridgeMessageStatus, setBridgeMessageStatus] = useState<string>("Verification is in progress");

	useEffect(() => {
		let t: NodeJS.Timeout;
		const fetchFata = async () => {
			try {
				const response: AxiosResponse<DepositsResponse> = await axios.get(
					`${process.env.REACT_APP_ZK_EVM_TESTNET_ENDPOINT as string}${process.env.REACT_APP_RECEIVER_ADDRESS}`,
					{
						params: {
							limit: 100,
							offset: 0,
						},
					}
				);

				const account = await metamaskProvider?.getSigner();

				const depositsArray = response.data.deposits.filter(
					(value) => ("0x" + value.metadata.slice(26)).toLowerCase() === account?.address.toLowerCase()
				);

				console.log(depositsArray);

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
			{window.ethereum && (
				<>
					<Main />
					<FunctionalBar stage={stage} />
					<ProgressBar stage={`${stage === 1 ? "w-[33%]" : stage === 2 ? "w-[66%]" : "w-full"}`} />
				</>
			)}
		</Layout>
	);
}

export default App;
