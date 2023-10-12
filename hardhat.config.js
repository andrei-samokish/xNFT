/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const goerliPrivateKey = process.env.PRIVATE_KEY;
module.exports = {
	solidity: "0.8.20",
	networks: {
		goerli: {
			url: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
			accounts: [goerliPrivateKey],
		},
	},
};
