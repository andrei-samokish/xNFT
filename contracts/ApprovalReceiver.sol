// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {IBridgeMessageReceiver} from "./interfaces/IBridgeMessageReceiver.sol";
import {IPolygonZkEVMBridge} from "./interfaces/IPolygonZkEVMBridge.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ApprovalReceiver is IBridgeMessageReceiver, Ownable {
    address immutable zkEVMBridgeAddress;
    // Current network identifier
    uint32 public immutable networkID;

    // Address in the other network that will send the message
    address public messageSender;

    mapping(address => bool) private _permissions;

    constructor(address bridge) Ownable(_msgSender()) {
        zkEVMBridgeAddress = bridge;
        networkID = IPolygonZkEVMBridge(zkEVMBridgeAddress).networkID();
    }

    function setSender(address newMessageSender) external onlyOwner {
        messageSender = newMessageSender;
    }

    function getPermission(address user) public view returns (bool) {
        return _permissions[user];
    }

    function onMessageReceived(
        address originAddress,
        uint32,
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

        _permissions[abi.decode(data, (address))] = true;
    }
}
