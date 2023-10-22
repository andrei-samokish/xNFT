import { PropsWithChildren } from "react";
import Header from "./Header";
import { MetaMaskProvider } from "@metamask/sdk-react";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className="px-20 py-12">
			<MetaMaskProvider
				debug={false}
				sdkOptions={{
					logging: {
						developerMode: false,
					},
					checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
					dappMetadata: {
						name: "xNFT",
						url: window.location.host,
					},
				}}>
				<Header />
				{children}
			</MetaMaskProvider>
		</div>
	);
}
