// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
Structs

You can define your own type by creating a struct.
They are useful for grouping together related data.
Structs can be declared outside a contract and imported in another contract.
*/
contract Todos {
    struct Todo {
        string text;
        bool completed;
    }

    // An array of 'Todo' structs
    Todo[] public todos;

    function create(string calldata _text) public {
        // 3 ways to initialize a struct
        // 1. calling it like a function
        todos.push(Todo(_text, false));

        // 2. key value mapping
        todos.push(Todo({text: _text, completed: false}));

        // 3. initialize an empty struct and then update it
        Todo memory todo;
        todo.text = _text;
        // todo.completed initialized to false;

        todos.push(todo);
    }

    // Solidity automatically created a getter for 'todos' so
    // you don't actually need this function.
    function get(uint256 _index)
        public
        view
        returns (string memory text, bool completed)
    {
        Todo memory todo = todos[_index];
        return (todo.text, todo.completed);
    }

    function updateText(uint256 _index, string calldata _text) public {
        Todo storage todo = todos[_index];
        todo.text = _text;
    }

    // update completed
    function toggleCompleted(uint256 _index) public {
        Todo storage todo = todos[_index];
        todo.completed = !todo.completed;
    }

    function length() public view returns (uint256) {
        return todos.length;
    }
}

import "./helpers/Todo001.sol";

contract Todos001 {
    // An array of 'Todo' structs;
    Todo001[] public todos;
}
