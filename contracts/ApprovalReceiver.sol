// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {IBridgeMessageReceiver} from "./interfaces/IBridgeMessageReceiver.sol";
import {IPolygonZkEVMBridge} from "./interfaces/IPolygonZkEVMBridge.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ApprovalReceiver is IBridgeMessageReceiver, Ownable {
    event MessageReceived(address indexed account);

    /**
     * @notice Bridge address in receiving network
     */
    address private immutable ZKEVMBRIDGE;

    /**
     * @notice Address of sender contract in base network
     */
    address private messageSender;

    /**
     * @notice Boolean value for user's allowance to mint an NFT
     */
    mapping(address => bool) private _permissions;

    constructor(address bridge) Ownable(_msgSender()) {
        ZKEVMBRIDGE = bridge;
    }

    /**
     * @param newMessageSender Address of new 'messageSender' variable value
     */
    function setSender(address newMessageSender) external onlyOwner {
        messageSender = newMessageSender;
    }

    /**
     * @dev Read-function for '_permissions' mapping
     * @param user Account to check for permission
     */
    function getPermission(address user) public view returns (bool) {
        return _permissions[user];
    }

    /**
     * @dev Invoked on claiming message from Bridge SC
     * @param originAddress Address of mint verifier
     * @param data Encoded user address that is verified for mint
     */
    function onMessageReceived(
        address originAddress,
        uint32,
        bytes memory data
    ) external payable override {
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

        _permissions[account] = true;

        emit MessageReceived(account);
    }
}
