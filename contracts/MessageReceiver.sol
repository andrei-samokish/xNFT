// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;
import {IBridgeMessageReceiver} from "./interfaces/IBridgeMessageReceiver.sol";
import {IPolygonZkEVMBridge} from "./interfaces/IPolygonZkEVMBridge.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MessageReceiver is IBridgeMessageReceiver, Ownable {
    address constant zkEVMBridgeAddress =
        0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7;
    // Current network identifier
    uint32 public immutable networkID;

    // Address in the other network that will send the message
    address public messageSender;

    uint256 messageValue;

    constructor() Ownable(_msgSender()) {
        networkID = IPolygonZkEVMBridge(zkEVMBridgeAddress).networkID();
    }

    function setSender(address newMessageSender) external onlyOwner {
        messageSender = newMessageSender;
    }

    function onMessageReceived(
        address originAddress,
        uint32 originNetwork,
        bytes memory data
    ) external payable override {
        // Can only be called by the bridge
        require(
            msg.sender == zkEVMBridgeAddress,
            "MessageReceiver::onMessageReceived: Not PolygonZkEVMBridge"
        );

        // Can only be called by the sender on the other network
        require(
            messageSender == originAddress,
            "MessageReceiver::onMessageReceived: Not message Sender"
        );

        // Decode data
        messageValue = abi.decode(data, (uint256));
    }
}
