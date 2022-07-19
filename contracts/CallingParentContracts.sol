// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/* Inheritance tree
   A
 /  \
B   C
 \ /
  D
*/

contract AA {
    // This is called an event. You can emit events from your function
    // and they are logged into the transaction log.
    // In our case, this will be useful for tracing function calls.
    event Log(string message);

    function foo() public virtual {
        emit Log("AA.foo called");
    }

    function bar() public virtual {
        emit Log("AA.bar called");
    }
}

contract BB is AA {
    function foo() public virtual override {
        emit Log("BB.foo called");
        AA.foo();
    }

    function bar() public virtual override {
        emit Log("BB.bar called");
        super.bar();
    }
}

contract CC is AA {
    function foo() public virtual override {
        emit Log("CC.foo called");
        AA.foo();
    }

    function bar() public virtual override {
        emit Log("CC.bar called");
        super.bar();
    }
}

contract DD is BB, CC {
    // Try:
    // - Call DD.foo and check the transaction logs.
    //   Although DD inherits AA, BB and CC, it only called CC and then AA.
    // - Call DD.bar and check the transaction logs.
    //   DD called CC, then BB, and finally AA.
    //   Although super was called twice (by BB and CC) it only called A once.

    function foo() public override(BB, CC) {
        super.foo();
    }

    function bar() public override(BB, CC) {
        super.bar();
    }
}
