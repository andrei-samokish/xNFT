// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @dev ERC20, ERC721, ERC777 contracts compliant interface to call balanceOf() function on them
 */

interface ERCXXX {
    function balanceOf(address account) external returns (uint256);
}