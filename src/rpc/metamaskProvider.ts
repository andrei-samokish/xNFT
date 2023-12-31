import { ethers } from "ethers";

let metamaskProvider: ethers.BrowserProvider | undefined;

if (typeof window.ethereum !== "undefined" && typeof window !== "undefined") {
	metamaskProvider = new ethers.BrowserProvider(window.ethereum);
}

export default metamaskProvider;
