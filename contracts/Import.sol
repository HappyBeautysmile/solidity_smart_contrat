// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// import Foo001.sol from current directory
import "./helpers/Foo001.sol";

// import {symbol as alias, symbol2} from "filename";
import {Unauthorized, add as func, Point} from "./helpers/Foo001.sol";

contract Import {
    // Initialize Foo001.sol
    Foo001 public foo = new Foo001();
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function getFooName() public view returns (string memory) {
        return foo.name();
    }

    function getPoint(uint256 _x, uint256 _y)
        public
        pure
        returns (Point memory)
    {
        return Point(_x, _y);
    }

    function isOwner() public view returns (bool) {
        if (owner != msg.sender) {
            revert Unauthorized(msg.sender);
        }

        return true;
    }

    function addNum(uint256 _x, uint256 _y) public pure returns (uint256) {
        return func(_x, _y);
    }
}
