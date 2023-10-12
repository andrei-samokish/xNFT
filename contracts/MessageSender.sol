// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IPolygonZkEVMBridge} from "./interfaces/IPolygonZkEVMBridge.sol";

contract MessageSender {
    address constant zkEVMBridgeAddress = 0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7;
    //ApeCoin contract address
    bytes4 bridgeMessageSelector = IPolygonZkEVMBridge.bridgeMessage.selector;
    //ChainIn = 1 (for zkEVM)
    uint32 constant zkEVMTestnetChainId = 1;
    address public targetContract;

    function setReceiver(address _receiver) public {
        targetContract = _receiver;
    }

    function sendMessage(string memory _data) public payable {
        bytes memory _metadata = abi.encode(_data);
        (bool success, bytes memory data) = zkEVMBridgeAddress
        .call{value: msg.value}(
            abi.encodeWithSelector(
                bridgeMessageSelector,
                zkEVMTestnetChainId,
                targetContract,
                true,
                _metadata
            )
        );
    }
}