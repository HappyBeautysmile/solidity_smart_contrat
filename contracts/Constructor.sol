// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Constructor

A constructor is an optional function that is executed upon contract creation.
Here are examples of how to pass arguments to constructors.
*/

// Base contract X
contract X {
    event XCall();

    string public name;

    constructor(string memory _name) {
        emit XCall();

        name = _name;
    }
}

// Base contract Y
contract Y {
    event YCall();

    string public text;

    constructor(string memory _text) {
        emit YCall();

        text = _text;
    }
}

// There are 2 ways to initialize parent contract with parameters.

// Pass the parameters here in the inheritance list.
contract B002 is X("Input to X"), Y("Input to Y") {

}

contract C002 is X, Y {
    // Pass the parameters here in the constructor,
    // similar to function modifiers.

    constructor(string memory _name, string memory _text) X(_name) Y(_text) {}
}

// Parent constructors are always called in the order of inheritance
// regardless of the order of parent contracts listed in the
// constructor of the child contract.

// Order of constructors called:
//  1. X
//  2. Y
//  3. D
contract D002 is X, Y {
    event DCall();

    constructor() X("X was called") Y("Y was called") {
        emit DCall();
    }
}

// Order of constructors called:
//  1. X
//  2. Y
//  3. E

contract E002 is X, Y {
    event ECall();

    constructor() Y("Y was called") X("X was called") {
        emit ECall();
    }
}
