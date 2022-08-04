// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Ether and Wei

Transactions are paid with either.
Similar to how one dollar is equal to 100 cent, one ether is equal to 10^18 wei.
*/
contract EtherUnits {
    uint256 public oneWei = 1 wei;
    // 1 wei is equal to 1;
    bool public isOneWei = 1 wei == 1;

    uint256 public oneEther = 1 ether;
    // 1 ether is equal to 10^18 wei
    bool public isOneEther = 1 ether == 1e18;
}
