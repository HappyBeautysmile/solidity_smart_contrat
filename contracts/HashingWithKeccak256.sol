// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Hashing with Keccak256

Some use cases are:
  - Creating a deterministic unique ID from a input
  - Commit-Reveal scheme
  - Compact cryptographic signature (by sigining the hash instead of a larget input) 
*/
contract HashFunction {
    function hash(
        string memory _text,
        uint256 _num,
        address _addr
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_text, _num, _addr));
    }

    // Example of hash collision
    // Hash collision can occur when you pass more than one dynamic data type
    // to abi.encodePacked. In such case, you should use abi.encode instead.
    function encodePacked(string memory _text, string memory _anotherText)
        public
        pure
        returns (bytes32)
    {
        // Same result
        // encodePacked(AAA, BBB) -> AAABBB
        // encodePacked(AA, ABBB) -> AAABBB
        return keccak256(abi.encodePacked(_text, _anotherText));
    }

    function encode(string memory _text, string memory _anotherText)
        public
        pure
        returns (bytes32)
    {
        // Different result
        // encodePacked(AAA, BBB)
        // encodePacked(AA, ABBB)
        return keccak256(abi.encode(_text, _anotherText));
    }
}

contract GuessTheMagicWord {
    bytes32 public answer =
        0x60298f78cc0b47170ba79c10aa3851d7648bd96f2f8e46a19dbc777c36fb0c00;

    // Magic word is "Solidity"
    function guess(string memory _word) public view returns (bool) {
        return keccak256(abi.encodePacked(_word)) == answer;
    }
}
