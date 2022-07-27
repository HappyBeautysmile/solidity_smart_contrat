// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

struct Point {
    uint256 x;
    uint256 y;
}

error Unauthorized(address caller);

function add(uint256 x, uint256 y) pure returns (uint256) {
    return x + y;
}

contract Foo001 {
    string public name = "Foo001";
}
