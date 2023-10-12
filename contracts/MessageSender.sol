// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.8.20;

import "./IBridgeMessageReceiver.sol";
import "./IPolygonZkEVMBridge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ZkEVMNFTBridge is an example contract to use the message layer of the PolygonZkEVMBridge to bridge NFTs
 */
contract PingSender is Ownable {
    // Global Exit Root address
    IPolygonZkEVMBridge public constant polygonZkEVMBridge =
        IPolygonZkEVMBridge(0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7);

    // Address in the other network that will receive the message
    address public pingReceiver;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Emitted when send a message to another network
     */
    event PingMessage(uint256 pingValue);

    /**
     * @dev Emitted when change the receiver
     */
    event SetReceiver(address newPingReceiver);

    /**
     * @notice Send a message to the other network
     * @param destinationNetwork Network destination
     * @param forceUpdateGlobalExitRoot Indicates if the global exit root is updated or not
     */
    function bridgePingMessage(
        uint32 destinationNetwork,
        bool forceUpdateGlobalExitRoot,
        uint256 pingValue
    ) public onlyOwner {
        bytes memory pingMessage = abi.encode(pingValue);

        // Bridge ping message
        polygonZkEVMBridge.bridgeMessage(
            destinationNetwork,
            pingReceiver,
            forceUpdateGlobalExitRoot,
            pingMessage
        );

        emit PingMessage(pingValue);
    }

    /**
     * @notice Set the receiver of the message
     * @param newPingReceiver Address of the receiver in the other network
     */
    function setReceiver(address newPingReceiver) external onlyOwner {
        pingReceiver = newPingReceiver;
        emit SetReceiver(newPingReceiver);
    }
}
