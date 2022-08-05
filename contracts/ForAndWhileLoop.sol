// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Loop {
    function loop() public pure returns (uint256) {
        uint256 i; // to return result

        // for loop
        // for (uint256 i = 0; i < 10; i++) {}
        for (; i < 10; i++) {
            if (i == 3) {
                // Skip to next iteration with continue
                continue;
            }

            if (i == 5) {
                // Exit loop with break;
                break;
            }
        }

        return i;
    }

    function whileLoop() public pure returns (uint256) {
        uint256 j;

        while (j < 10) {
            j++;
        }

        return j;
    }
}
