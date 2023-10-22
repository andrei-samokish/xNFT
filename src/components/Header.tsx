import { useState } from "react";
import metamaskProvider from "../rpc/metamaskProvider";
import { MetaMaskProvider, useSDK } from "@metamask/sdk-react";

export default function Header() {
	const [show, setShow] = useState(false);

	const { sdk, provider, account } = useSDK();

	async function handleConnectClick() {
		await sdk?.connect();
	}

	async function handleLogoutClick() {
		sdk?.terminate();
	}
	return (
		<div className="flex flex-row justify-between">
			{account && (
				<div className="flex flex-col absolute gap-2">
					<span
						className=" bg-secondary w-32 h-10 rounded-3xl flex flex-row gap-2 justify-between p-3 items-center hover:cursor-pointer"
						onClick={() => setShow((prev) => !prev)}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M13.28 5.96667L8.93333 10.3133C8.42 10.8267 7.58 10.8267 7.06667 10.3133L2.72 5.96667"
								stroke="#292D32"
								stroke-width="1.5"
								stroke-miterlimit="10"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<p>{`${account?.slice(0, 5)}...${account?.slice(-3)}`}</p>
					</span>
					{show && (
						<span
							className=" bg-secondary w-32 h-10 rounded-3xl flex flex-row gap-2 justify-between p-3 items-center hover:cursor-pointer relative top-0"
							onClick={handleLogoutClick}>
							Logout
						</span>
					)}
				</div>
			)}
			{!account && (
				<div
					className="bg-secondary block w-80 h-10 rounded-md text-center py-2 hover:cursor-pointer"
					onClick={handleConnectClick}>
					Connect wallet
				</div>
			)}
		</div>
	);
}
