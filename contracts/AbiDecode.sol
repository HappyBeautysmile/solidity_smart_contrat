// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
ABI Decode

abi.encode encodes data into bytes.
abi.decode decodes bytes back into data.
 */

contract AbiDecode {
    struct MyStruct {
        address sender;
        uint256[2] nums;
    }

    function encode(
        uint256 _x,
        address _addr,
        MyStruct calldata _myStruct
    ) external pure returns (bytes memory) {
        return abi.encode(_x, _addr, _myStruct);
    }

    function decode(bytes calldata data)
        external
        pure
        returns (
            uint256 x_,
            address addr_,
            MyStruct memory myStruct_
        )
    {
        // (uint256 x_, address addr_, MyStruct memory myStruct) = ...
        (x_, addr_, myStruct_) = abi.decode(data, (uint256, address, MyStruct));
    }
}
