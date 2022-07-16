// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
First Application
Here is a simple contract that you can get, increment and decrement the count store in this contract.
*/

contract Counter002 {
    uint256 public count;

    // Function to get the current count
    function get() public view returns (uint256) {
        return count;
    }

    // Function to increment count by 1
    function inc() public {
        count += 1;
    }

    // Function to decrement count by 1
    function dec() public {
        count -= 1;
    }
}
