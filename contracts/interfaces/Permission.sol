// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

interface Permission {
    function getPermission(address user) external returns (bool);
}
