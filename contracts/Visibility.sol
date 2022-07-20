// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
Visibility
Functions and state variables have to declare whether they are accessible by other contracts.

Functions can be declared as

public - any contract and account can call
private - only inside the contract that defines the function
internal- only inside contract that inherits an internal function
external - only other contracts and accounts can call
State variables can be declared as public, private, or internal but not external.
 */

contract Base {
    // State variables
    string public publicVar = "my public variable";
    string internal internalVar = "my internal variable";
    string private privateVar = "my private variable";

    // State variables cannot be external so this code won't compile.
    //   - Expected identifier but got 'external'solidity(2314)
    // string external externalVar = "my external variable";

    // Public functions can be called
    //   - inside this contract
    //   - inside contracts that inherit this contract
    //   - by other contracts and accounts
    function publicFunc() public pure returns (string memory) {
        return "public function called";
    }

    // External functions can only be called
    //   - by other contracts and accounts
    function externalFunc() external pure returns (string memory) {
        return "external function called";
    }

    // This function will not compile since we're trying to call
    // an external function here.
    //    - Undeclared identifier. Did you mean "internalFunc" or "externalFunc"?solidity(7576)

    // function testExternalFunc() public pure returns (string memory) {
    //     return externalFunc();
    // }

    // Internal function can be called
    //   - inside this contract
    //   - inside contracts that inherit this contract
    function internalFunc() internal pure returns (string memory) {
        return "internal function called";
    }

    function testInternalFunc() public pure virtual returns (string memory) {
        return internalFunc();
    }

    // Private function can only be called
    //   - inside this contract
    // Contracts that inherit this contract cannot call this function.
    //   - "virtual" and "private" cannot be used together.solidity(3942)
    function privateFunc() private pure returns (string memory) {
        return "private function called";
    }

    function testPrivateFunc() public pure virtual returns (string memory) {
        return privateFunc();
    }
}

contract Child is Base {
    // Inherited contracts do not have access to private functions
    // and state variables.
    //   - Member "privateFunc" not found or not visible after argument-dependent lookup in type(contract super Child).solidity(9582)
    // function testPrivateFunc() public pure override returns (string memory) {
    //     return super.privateFunc();
    // }

    // Internal function call be called inside child contracts
    function testInternalFunc() public pure override returns (string memory) {
        return super.internalFunc();
    }
}
