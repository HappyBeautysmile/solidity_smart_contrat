// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    string public name = "Solidity by Example";
    string public symbol = "SOLBYEX";
    uint8 public decimals = 18;

    function transfer(address _recipient, uint256 _amount)
        external
        returns (bool)
    {
        balanceOf[msg.sender] -= _amount;
        balanceOf[_recipient] += _amount;

        emit Transfer(msg.sender, _recipient, _amount);

        return true;
    }

    function approve(address _spender, uint256 _amount)
        external
        returns (bool)
    {
        allowance[msg.sender][_spender] = _amount;

        emit Approval(msg.sender, _spender, _amount);

        return true;
    }

    function transferFrom(
        address _sender,
        address _recipient,
        uint256 _amount
    ) external returns (bool) {
        allowance[_sender][msg.sender] -= _amount;
        balanceOf[_sender] -= _amount;
        balanceOf[_recipient] += _amount;

        emit Transfer(_sender, _recipient, _amount);

        return true;
    }

    function mint(uint256 _amount) external {
        balanceOf[msg.sender] += _amount;
        totalSupply += _amount;

        emit Transfer(address(0), msg.sender, _amount);
    }

    function burn(uint256 _amount) external {
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;

        emit Transfer(msg.sender, address(0), _amount);
    }
}
