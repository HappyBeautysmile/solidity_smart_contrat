// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Gas Saving Techniques

Some gas saving techniques.
  1. Replacing memory with calldata
  2. Loading state variable to memory
  3. Replace for loop i++ with ++i
  4. Caching array elements
  5. Short circuit
*/

contract GasGolf {
    // start
    // use calldata
    // load state variables to memory
    // short circuit
    // loop increments
    // cache array length
    // load array elements to memory
    // uncheck i overflow/underflow

    uint256 public total;

    // start - not gas optimized
    function sumIfEvenAndLessThan99(uint256[] memory _nums) external {
        for (uint256 i = 0; i < _nums.length; i += 1) {
            bool isEven = _nums[i] % 2 == 0;
            bool isLessThan99 = _nums[i] < 99;

            if (isEven && isLessThan99) {
                total += _nums[i];
            }
        }
    }

    // use calldata, load state variables to memory
    function first(uint256[] calldata _nums) external {
        uint256 total_;

        for (uint256 i = 0; i < _nums.length; i += 1) {
            bool isEven = _nums[i] % 2 == 0;
            bool isLessThan99 = _nums[i] < 99;

            if (isEven && isLessThan99) {
                total_ += _nums[i];
            }
        }
        total = total_;
    }

    // cache array length
    function second(uint256[] calldata _nums) external {
        uint256 total_;
        uint256 len = _nums.length;

        for (uint256 i = 0; i < len; i += 1) {
            bool isEven = _nums[i] % 2 == 0;
            bool isLessThan99 = _nums[i] < 99;

            if (isEven && isLessThan99) {
                total_ += _nums[i];
            }
        }

        total = total_;
    }

    // loop increments, short circuit, load array elements to memory
    function third(uint256[] calldata _nums) external {
        uint256 total_;
        uint256 len = _nums.length;

        for (uint256 i = 0; i < len; ++i) {
            uint256 num = _nums[i];

            if (num % 2 == 0 && num < 99) {
                total_ += num;
            }
        }

        total = total_;
    }

    function last(uint256[] calldata _nums) external {
        uint256 total_;
        uint256 len = _nums.length;

        for (uint256 i = 0; i < len; ) {
            uint256 num = _nums[i];

            if (num % 2 == 0 && num < 99) {
                total_ += num;
            }

            total = total_;

            unchecked {
                ++i;
            }
        }
    }
}
