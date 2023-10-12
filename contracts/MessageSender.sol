// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./interfaces/IBridgeMessageReceiver.sol";
import "./interfaces/IPolygonZkEVMBridge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ERCXXX.sol";

/**
 * TODO: Commentaries + tests
 */
contract PingSender is Ownable {
    IPolygonZkEVMBridge public immutable polygonZkEVMBridge;

    ERCXXX public baseAsset;
    uint256 public amountRequired;

    address public pingReceiver;

    constructor(IPolygonZkEVMBridge bridgeAddress) Ownable(msg.sender) {
        polygonZkEVMBridge = bridgeAddress; //0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7 -- testnet
    }

    /**
     * @dev Emitted when send a message to another network
     */
    event PingMessage(address pingValue);

    /**
     * @dev Emitted when change the receiver
     */
    event SetReceiver(address newPingReceiver);

    event AssetChanged(address baseAsset, uint256 amountRequired);

    function confirmOwnership() external {
        uint256 userBalance = baseAsset.balanceOf(msg.sender);

        if (userBalance >= amountRequired) bridgePingMessage(msg.sender);
        else revert("PingSender: User is not allowed to mint");
    }

    /**
     * @notice Set the receiver of the message
     * @param newPingReceiver Address of the receiver in the other network
     */
    function setReceiver(address newPingReceiver) external onlyOwner {
        pingReceiver = newPingReceiver;
        emit SetReceiver(newPingReceiver);
    }

    function changeBaseAsset(address asset, uint256 amount) external onlyOwner {
        require(
            isContract(asset),
            "PingSender: Asset address is not a contract"
        );
        baseAsset = ERCXXX(asset);
        amountRequired = amount;

        emit AssetChanged(asset, amount);
    }

    /**
     * @notice Send a message to the other network
     * @param account Address that is allowed to mint
     */
    function bridgePingMessage(address account) private onlyOwner {
        bytes memory pingMessage = abi.encode(account);

        // Bridge ping message
        polygonZkEVMBridge.bridgeMessage(1, pingReceiver, true, pingMessage);

        emit PingMessage(account);
    }

    function isContract(address addr) private view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
