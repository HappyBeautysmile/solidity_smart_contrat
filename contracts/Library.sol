// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Library

Libraries are similar to contracts, but you can't declare any state variable and you can't send ether.
A library is embedded into the contract if all library functions are internal.
Otherwise the library must be deployed and then linked before the contract is deployed.
 */

library SafeMath {
    function add(uint256 _x, uint256 _y) internal pure returns (uint256) {
        // After 0.8 version, It become built-in function.
        require(_x + _y > _x, "uint256 overflow");
        return _x + _y;
    }
}

library Math {
    function sqrt(uint256 _y) internal pure returns (uint256 z_) {
        if (_y > 3) {
            z_ = _y;
            uint256 x = _y / 2 + 1;
            while (x < z_) {
                z_ = x;
                x = (_y / x + x) / 2;
            }
        } else if (_y != 0) {
            z_ = 1;
        }
        // else z = 0 (default value)
    }
}

contract TestSafeMath {
    using SafeMath for uint256;

    uint256 public MAX_UINT = 2**256 - 1;

    function testAdd(uint256 _x, uint256 _y) public pure returns (uint256) {
        return _x.add(_y); // can use directly
    }

    function testAddWithMaxUint(uint256 _x) public view returns (uint256) {
        return MAX_UINT.add(_x);
    }

    function testSquareRoot(uint256 _x) public pure returns (uint256) {
        return Math.sqrt(_x);
    }
}

// Array function to delete element at index and re-organize the array
// so that their are no gaps between the elements.
library Array {
    function remove(uint256[] storage _arr, uint256 _index) internal {
        // Move the last element into the place to delete
        require(_arr.length > 0, "Can't remove from empty array");
        _arr[_index] = _arr[_arr.length - 1];
        _arr.pop();
    }
}

contract TestArray {
    using Array for uint256[];

    uint256[] public arr = [1, 2, 3];

    function testArrayRemove(uint256 _index) public returns (uint256[] memory) {
        arr.remove(_index);

        return arr;
    }
}
