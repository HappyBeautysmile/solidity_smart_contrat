// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Calling Other Contract

Contract can call other contracts in 2 ways.
The easiest way to is to just call it, like `A.foo(x, y, z)`
Another way to call other contracts is to use the low-level call.
This method is not recommended.
 */
contract Callee001 {
    uint256 public x;
    uint256 public value;

    function setX(uint256 _x) public returns (uint256) {
        x = _x;
        return x;
    }

    function setXAndSendEther(uint256 _x)
        public
        payable
        returns (uint256, uint256)
    {
        x = _x;
        value = msg.value;

        return (x, value);
    }

    function getSelector(string calldata _func) external pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }
}

contract Caller001 {
    function setX(Callee001 _callee, uint256 _x) public returns (uint256) {
        return _callee.setX(_x);
    }

    function setXFromAddress(address _addr, uint256 _x)
        public
        returns (uint256)
    {
        Callee001 callee = Callee001(_addr);
        return callee.setX(_x);
    }

    function setXAndSendEther(Callee001 _callee, uint256 _x)
        public
        payable
        returns (uint256, uint256)
    {
        (uint256 x, uint256 value) = _callee.setXAndSendEther{value: msg.value}(
            _x
        );

        return (x, value);
    }
}
