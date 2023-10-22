// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// xNFT is an ERC721-compliant NFT contract that extends ERC721, ERC721URIStorage, and ERC721Enumerable.
contract xNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    error PermissionDenied(address account);
    event MessageReceived(address indexed account);

    // Counter for token IDs.
    uint public tokenIdCounter = 1;

    // Maximum supply of NFTs.
    uint256 public MAX_SUPPLY = 5;

    /**
     * @notice Bridge address in receiving network
     */
    address private immutable ZKEVMBRIDGE;

    /**
     * @notice Address of sender contract in base network
     */
    address private messageSender;

    // Constructor initializes the contract with a name and symbol.
    constructor(address bridge) ERC721("xNFT", "X") Ownable(msg.sender) {
        ZKEVMBRIDGE = bridge;
    }

    // _baseURI provides the base URI for token metadata.
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://Qme5bKfySCqnMdU9icBMUXPU3Y3yH29wYqkLYjNybvEyWL";
    }

    // tokenURI overrides the tokenURI function to support ERC721URIStorage.
    function tokenURI(
        uint tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721Enumerable, ERC721) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 amount
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    // supportsInterface overrides the supportsInterface function for additional interfaces.
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @param newMessageSender Address of new 'messageSender' variable value
     */
    function setSender(address newMessageSender) external onlyOwner {
        messageSender = newMessageSender;
    }

    function onMessageReceived(
        address originAddress,
        uint32,
        bytes memory data
    ) external payable {
        // Can only be called by the bridge
        require(
            msg.sender == ZKEVMBRIDGE,
            "MessageReceiver::onMessageReceived: Not PolygonZkEVMBridge"
        );

        // Can only be called by the sender on the other network
        require(
            messageSender == originAddress,
            "MessageReceiver::onMessageReceived: Not message Sender"
        );

        address account = abi.decode(data, (address));

        require(
            ERC721Enumerable.totalSupply() <= MAX_SUPPLY,
            "All tokens have been minted"
        );

        _safeMint(account, tokenIdCounter);
        _setTokenURI(tokenIdCounter, Strings.toString(tokenIdCounter));

        tokenIdCounter++;

        emit MessageReceived(account);
    }
}
