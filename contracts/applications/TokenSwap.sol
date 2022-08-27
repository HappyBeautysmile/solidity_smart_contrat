// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";

/**
Contract to swap tokens

Here is an example contract, TokenSwap, to trade one ERC20 token for another.
This contract will swap tokens by calling

`transferFrom(address sender, address recipient, uint256 amount)

which will transfer amount of token from sender to recipient.

For transferFrom to succeed, sender must
  - have more than amount tokens in their balance
  - allowed TokenSwap to withdraw amount tokens by calling approve

prior to TokenSwap calling transferFrom
*/

contract TokenSwap {
    /**
    1. ALice has 100 tokens from AliceCoin, which is a ERC20 token.
    2. Bob has 100 tokens from BobCoin, which is also a ERC20 token.
    3. Alice and Bob wants to trade 10 AliceCoin for 20 BobCoin.
    4. Alice or Bob deploys TokenSwap
    5. Alice approves TokenSwap to withdraw 10 tokens from AliceCoin
    6. Bob approves TokenSwap to withdraw 20 tokens from BobCoin
    7. Alice or Bob calls TokenSwap.swap()
    8. Alice and Bob traded tokens successfully.
    */
    IERC20 public token1;
    address public owner1;
    uint256 public amount1;
    IERC20 public token2;
    address public owner2;
    uint256 public amount2;

    constructor(
        address _token1,
        address _owner1,
        uint256 _amount1,
        address _token2,
        address _owner2,
        uint256 _amount2
    ) {
        token1 = IERC20(_token1);
        owner1 = _owner1;
        amount1 = _amount1;
        token2 = IERC20(_token2);
        owner2 = _owner2;
        amount2 = _amount2;
    }

    function swap() public {
        require(msg.sender == owner1 || msg.sender == owner2, "Not authorized");
        require(
            token1.allowance(owner1, address(this)) >= amount1,
            "Token 1 allowance too low"
        );
        require(
            token2.allowance(owner2, address(this)) >= amount2,
            "Token 2 allowance too low"
        );

        _safeTransferFrom(token1, owner1, owner2, amount1);
        _safeTransferFrom(token2, owner2, owner1, amount2);
    }

    function _safeTransferFrom(
        IERC20 _token,
        address _sender,
        address _recipient,
        uint256 _amount
    ) private {
        bool sent = _token.transferFrom(_sender, _recipient, _amount);
        require(sent, "Token transfer failed");
    }
}
