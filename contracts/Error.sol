// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Error

An error will undo all changes made to the state during a transaction.
You can throw an error by calling require, revert or assert.
  - require is used to validate inputs and conditions before execution.
  - revert is similar to require. See the code below for details.
  - assert is used to check for code that should never be false.
    Failing assertion probably means that there is a bugs.
*/
contract Error {
    function testRequire(uint256 _i) public pure {
        // Require should be used to validate conditions such as:
        //  - inputs
        //  - conditions before execution
        //  - return values from calls to other functions
        require(_i > 10, "Input must be greater than 10");
    }

    function testRevert(uint256 _i) public pure {
        // Revert is useful when the condition to check is complex.
        // This code does the exact same thing as the example above
        if (_i <= 10) {
            revert("Input must be greater than 10");
        }
    }

    uint256 public num;

    function testAssert() public view {
        // Assert should only be used to test for internal errors,
        // and to check invariants.

        // Here we assert that number is always equal to 0
        // since it is impossible to update the value of num
        assert(num == 0);
    }

    function setNum(uint256 _num) external {
        num = _num;
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function testCustomError(uint256 _withdrawAmount) public view {
        uint256 bal = address(this).balance;

        if (bal < _withdrawAmount) {
            revert InsufficientBalance({
                balance: bal,
                withdrawAmount: _withdrawAmount
            });
        }
    }
}

// Here is another example
contract Account {
    uint256 public balance;
    uint256 public constant MAX_UINT = 2**256 - 1;

    function deposit(uint256 _amount) public {
        uint256 oldBalance = balance;
        uint256 newBalance = balance + _amount;

        // balance + _amount does not overflow if balance + _amount >= balance
        require(newBalance >= oldBalance, "Overflow");

        balance = newBalance;

        assert(balance >= oldBalance);
    }

    function withdraw(uint256 _amount) public {
        uint256 oldBalance = balance;

        // balance - _amount does not underflow if balance >= _amount
        require(balance >= _amount, "Underflow");

        if (balance < _amount) {
            revert("Underflow");
        }

        balance -= _amount;

        assert(balance <= oldBalance);
    }
}
