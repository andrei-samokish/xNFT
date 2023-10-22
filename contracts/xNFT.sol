// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./ApprovalReceiver.sol";

// xNFT is an ERC721-compliant NFT contract that extends ERC721, ERC721URIStorage, and ERC721Enumerable.
contract XNFT is ERC721, ERC721URIStorage, ERC721Enumerable, ApprovalReceiver {
    error PermissionDenied(address account);
    // Counter for token IDs.
    uint public tokenIdCounter;

    // Maximum supply of NFTs.
    uint256 public MAX_SUPPLY = 5;

    // Constructor initializes the contract with a name and symbol.
    constructor(
        address bridge
    ) ERC721("xNFT", "X") ApprovalReceiver(bridge) {}

    // safeMint allows the owner to mint NFTs safely.
    function safeMint(address to, string calldata _tokenURI) public {
        if (!getPermission(to)) revert PermissionDenied(to);

        require(
            ERC721Enumerable.totalSupply() < MAX_SUPPLY,
            "All tokens have been minted"
        );

        _safeMint(to, tokenIdCounter);
        _setTokenURI(tokenIdCounter, _tokenURI);

        tokenIdCounter++;
    }

    // _baseURI provides the base URI for token metadata.
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmZxNzwyrVN48wnSmEpa7zM1kCCHpG3ZRbjsvRDWTuRpD6";
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
}
